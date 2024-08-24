export const contractAddress = "0x43d044cFD4259f94d3Bb40253e745D7B120064bD";

export const abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "content",
        type: "string",
      },
    ],
    name: "submitSenryu",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "senryuId",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint",
        name: "page",
        type: "uint",
      },
      {
        internalType: "uint",
        name: "pageSize",
        type: "uint",
      },
    ],
    name: "getSenryus",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "content",
            type: "string",
          },
          {
            internalType: "address",
            name: "author",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "voteCount",
            type: "uint256",
          },
        ],
        internalType: "struct SenryuGame.Senryu[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint",
        name: "page",
        type: "uint",
      },
      {
        internalType: "uint",
        name: "pageSize",
        type: "uint",
      },
    ],
    name: "getTopSenryus",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "content",
            type: "string",
          },
          {
            internalType: "address",
            name: "author",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "voteCount",
            type: "uint256",
          },
        ],
        internalType: "struct SenryuGame.Senryu[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
