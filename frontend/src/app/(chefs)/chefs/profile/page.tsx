"use client";

import React, { useState, useEffect } from "react";
import ChefProfileForm from "../../../../components/ChefProfileForm";
import { client, selectSp } from "../../../../lib/client";
import { getOffchainAuthKeys } from "../../../../lib/offchainAuth";
import { useAccount } from "wagmi";
import { VisibilityType } from "@bnb-chain/greenfield-js-sdk";

// Define the type for profile data
type ProfileData = {
  name: string;
  description: string;
  specialty: string;
};

export default function ChefProfilePage() {
  const { address, connector } = useAccount();
  const [initialData, setInitialData] = useState<ProfileData>({
    name: "",
    description: "",
    specialty: "",
  });

  const fetchProfileData = async () => {
    try {
      const response = await fetch("/api/chefs/profile");
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      const data = await response.json();
      setInitialData(data);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Add type annotation to the profileData parameter
  const uploadToGreenfield = async (profileData: ProfileData) => {
    if (!address) {
      alert("Wallet address is missing");
      return;
    }

    const spInfo = await selectSp();
    const provider = await connector?.getProvider();
    const offChainData = await getOffchainAuthKeys(address, provider);

    if (!offChainData) {
      alert("No offchain auth data available");
      return;
    }

    const fileContent = JSON.stringify(profileData);
    const file = new File([fileContent], `${address}.json`, {
      type: "application/json",
    });

    try {
      const res = await client.object.delegateUploadObject(
        {
          bucketName: "chefs",
          objectName: `${address}.json`,
          body: file,
          delegatedOpts: {
            visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
          },
        },
        {
          type: "EDDSA",
          address: address,
          domain: window.location.origin,
          seed: offChainData.seedString,
        },
      );

      if (res.code === 0) {
        alert("Profile uploaded successfully to Greenfield!");
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Failed to upload profile to Greenfield:", err);
      alert("Failed to upload profile to Greenfield");
    }
  };

  const handleSubmit = async (profileData: ProfileData) => {
    try {
      const response = await fetch("/api/chefs/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        await uploadToGreenfield(profileData);
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return <ChefProfileForm onSubmit={handleSubmit} initialData={initialData} />;
}
