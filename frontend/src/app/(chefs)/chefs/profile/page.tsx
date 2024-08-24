"use client";

import React, { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { abi, contractAddress } from "../../../constants/contract"; // スマートコントラクトのABIとアドレス
import ChefProfileForm from "../../../../components/ChefProfileForm"; // 既存のフォームを使用

type ProfileData = {
  name: string;
  description: string;
  specialty: string;
};

export default function ChefProfilePage() {
  const [submitting, setSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<ProfileData>({
    name: "",
    description: "",
    specialty: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (profileData: ProfileData) => {
    console.log("Submitting profile data:", profileData);
    setSubmitting(true);
    setError(null);

    if (!window.ethereum) {
      setError("MetaMask is not installed!");
      setSubmitting(false);
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, abi, signer);

      // コントラクトにデータを送信
      const tx = await contract.submitChefProfile(
        profileData.name,
        profileData.description,
        profileData.specialty,
      );

      await tx.wait(); // トランザクションが完了するのを待つ
      alert("Profile submitted successfully!");
    } catch (error: any) {
      console.error("Error submitting profile:", error);
      if (error.code === 4001) {
        setError("MetaMask access denied");
      } else {
        setError("Failed to submit profile");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ChefProfileForm
      onSubmit={handleSubmit}
      initialData={{ name: "Jiro", description: "Toro", specialty: "Sushi" }}
    />
  );
}
