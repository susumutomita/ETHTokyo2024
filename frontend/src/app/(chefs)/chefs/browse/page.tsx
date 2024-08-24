"use client";
import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { abi, contractAddress } from "../../../constants/contract";

interface ChefProfile {
  address: string;
  name: string;
  description: string;
  specialty: string;
  voteCount: number;
}

export default function ViewChefs() {
  const [chefs, setChefs] = useState<ChefProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChefs = async () => {
      setLoading(true);
      setError(null); // Clear any existing errors

      if (!window.ethereum) {
        setError("MetaMask is not installed!");
        setLoading(false);
        return;
      }

      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(contractAddress, abi, signer);

        // getChefProfiles関数からデータを取得
        const [addresses, profiles] = await contract.getChefProfiles();

        // デバッグメッセージ
        console.log("Addresses:", addresses);
        console.log("Profiles:", profiles);

        // Proxyオブジェクトを通常のオブジェクトに変換
        const formattedChefs = addresses.map(
          (address: string, index: number) => {
            const profile = profiles[index].toObject(); // Proxyを解除して通常のオブジェクトに変換
            return {
              address,
              name: profile.name,
              description: profile.description,
              specialty: profile.specialty,
              voteCount: parseInt(profile.voteCount.toString(), 10), // Vote countを整数としてパース
            };
          },
        );

        setChefs(formattedChefs);
      } catch (error: any) {
        console.error("Error fetching chef profiles:", error);
        setError(`Failed to fetch chef profiles: ${error.message || error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchChefs();
  }, []);

  const vote = async (chefAddress: string) => {
    setLoading(true);
    setError(null); // Clear any existing errors

    if (!window.ethereum) {
      setError("MetaMask is not installed!");
      setLoading(false);
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, abi, signer);

      await contract.vote(chefAddress);

      // 投票後、最新のデータを再取得
      const [addresses, profiles] = await contract.getChefProfiles();
      const formattedChefs = addresses.map((address: string, index: number) => {
        const profile = profiles[index].toObject(); // Proxyを解除して通常のオブジェクトに変換
        return {
          address,
          name: profile.name,
          description: profile.description,
          specialty: profile.specialty,
          voteCount: parseInt(profile.voteCount.toString(), 10), // Vote countを整数としてパース
        };
      });

      setChefs(formattedChefs);
    } catch (error: any) {
      console.error("Error voting for chef:", error);
      if (error.code === 4001) {
        setError("MetaMask access denied");
      } else {
        setError("Failed to vote for chef");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="z-10 w-full max-w-xl px-5 xl:px-0 text-center"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <h1 className="text-3xl font-bold mb-6 text-white">Explore Chefs</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Specialty</th>
              <th className="py-2 px-4 border-b">Vote Count</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {chefs.map((chef) => (
              <tr key={chef.address}>
                <td className="py-2 px-4 border-b">{chef.name}</td>
                <td className="py-2 px-4 border-b">{chef.description}</td>
                <td className="py-2 px-4 border-b">{chef.specialty}</td>
                <td className="py-2 px-4 border-b">{chef.voteCount}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => vote(chef.address)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-md"
                  >
                    Vote
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
