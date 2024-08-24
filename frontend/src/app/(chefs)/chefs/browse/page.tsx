"use client";
import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { abi, contractAddresses } from "../../../constants/contract"; // ネットワークごとのアドレス

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
  const [amount, setAmount] = useState(""); // 送信するトークン量
  const [totalSupply, setTotalSupply] = useState(0); // トークンの全量
  const [userBalance, setUserBalance] = useState(0); // ユーザーのトークン残高
  const [contractAddress, setContractAddress] = useState<string>("");

  useEffect(() => {
    const fetchChefsAndTokenDetails = async () => {
      setLoading(true);
      setError(null);

      if (!window.ethereum) {
        setError("MetaMask is not installed!");
        setLoading(false);
        return;
      }

      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();

        // ネットワークIDに基づいてコントラクトアドレスを選択
        let selectedAddress = "";
        switch (network.chainId) {
          case BigInt(534351): // Scroll Testnet ID
            selectedAddress = contractAddresses.scrollTestnet;
            break;
          case BigInt(97): // BNB Testnet ID
            selectedAddress = contractAddresses.bnbTestnet;
            break;
          default:
            setError("Unsupported network");
            setLoading(false);
            return;
        }

        setContractAddress(selectedAddress);
        const contract = new Contract(selectedAddress, abi, signer);

        // シェフのプロファイルを取得
        const [addresses, profiles] = await contract.getChefProfiles();
        const formattedChefs = addresses.map(
          (address: string, index: number) => {
            const profile = profiles[index].toObject();
            return {
              address,
              name: profile.name,
              description: profile.description,
              specialty: profile.specialty,
              voteCount: parseInt(profile.voteCount.toString(), 10),
            };
          },
        );

        setChefs(formattedChefs);

        // トークンの全量とユーザーのトークン残高を取得
        const totalSupply = await contract.totalSupply();
        setTotalSupply(totalSupply.toString());

        const userAddress = await signer.getAddress();
        const balance = await contract.balanceOf(userAddress);
        setUserBalance(balance.toString());
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(`Failed to fetch data: ${error.message || error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchChefsAndTokenDetails();
  }, []);

  const vote = async (chefAddress: string) => {
    setLoading(true);
    setError(null);

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
        const profile = profiles[index].toObject();
        return {
          address,
          name: profile.name,
          description: profile.description,
          specialty: profile.specialty,
          voteCount: parseInt(profile.voteCount.toString(), 10),
        };
      });

      setChefs(formattedChefs);
    } catch (error: any) {
      console.error("Error voting for chef:", error);
      setError(`Failed to vote for chef: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const sendToken = async (chefAddress: string) => {
    setLoading(true);
    setError(null);

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

      const tx = await contract.sendToken(chefAddress, amount);
      await tx.wait();

      alert("Token sent successfully to " + chefAddress);

      // 送信後にユーザーのトークン残高を更新
      const userAddress = await signer.getAddress();
      const balance = await contract.balanceOf(userAddress);
      setUserBalance(balance.toString());
    } catch (error: any) {
      console.error("Error sending token:", error);
      setError(`Failed to send token: ${error.message || error}`);
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
        <>
          <p className="text-white">Total Token Supply: {totalSupply}</p>
          <p className="text-white">Your Token Balance: {userBalance}</p>

          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Specialty</th>
                <th className="py-2 px-4 border-b">Vote Count</th>
                <th className="py-2 px-4 border-b">Actions</th>
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
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-full shadow-md mr-2"
                    >
                      Vote
                    </button>
                    <button
                      onClick={() => sendToken(chef.address)}
                      className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-full shadow-md"
                    >
                      Send Token
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount to send"
              className="px-4 py-2 border rounded-md w-full"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded-md mt-4"
          >
            Back to Home
          </button>
        </>
      )}
    </div>
  );
}
