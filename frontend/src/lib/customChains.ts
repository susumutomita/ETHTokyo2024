// frontend/src/lib/customChains.ts

import { Chain } from "wagmi/chains";

export const scrollSepolia: Chain = {
  id: 534351,
  name: "Scroll Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia-rpc.scroll.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "ScrollScan",
      url: "https://scrollscan.com",
    },
  },
  testnet: true,
};

export const bscTestnet: Chain = {
  id: 97,
  name: "BNB Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "BNB",
    symbol: "BNB",
  },
  rpcUrls: {
    default: {
      http: ["https://bsc-testnet.bnbchain.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "BscScan",
      url: "https://testnet.bscscan.com",
    },
  },
  testnet: true,
};

export const greenfieldTestnet: Chain = {
  id: 5600,
  name: "Greenfield Mekong Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "BNB",
    symbol: "BNB",
  },
  rpcUrls: {
    default: {
      http: ["https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "GreenFieldScan",
      url: "https://testnet.greenfieldscan.com/",
    },
  },
  testnet: true,
};
