# CateringEscrow Smart Contract

This repository contains the CateringEscrow smart contract, which allows chefs to provide catering services in a decentralized way using smart contracts on various testnets, including Scroll, Linea, NERO, and BNB.

## Deployment Instructions

### Prerequisites

1. Install Foundry by following the instructions on the [Foundry GitHub page](https://github.com/foundry-rs/foundry).
2. Set up environment variables in an `.env` file. A sample configuration is provided in `.env.sample`.

### Environment Configuration

Make sure to create a `.env` file at the root of the project, using the following template. Replace the placeholders with your actual addresses and private keys.

```plaintext
# Scroll Sepolia Testnet configuration
SCROLL_RPC_URL=https://sepolia.base.org
SCROLL_SENDER_ADDRESS=0xYourScrollAddress
SCROLL_PRIVATE_KEY=your-scroll-private-key

# Linea Testnet configuration
LINEA_RPC_URL=https://linea-testnet-rpc-url
LINEA_SENDER_ADDRESS=0xYourLineaAddress
LINEA_PRIVATE_KEY=your-linea-private-key

# BNB Testnet configuration
BNB_TEST_RPC_URL=https://bsc-testnet.bnbchain.org
BNB_SENDER_ADDRESS=0xYourSepoliaAddress
BNB_PRIVATE_KEY=your-sepolia-private-key

# Other testnets and default configuration...
```

### Deploying to Testnets

#### Deploying to Scroll Sepolia Testnet

To deploy the CateringEscrow contract to the Scroll Sepolia Testnet, use the following command:

```bash
make deploy-scroll
```

This will use the `SCROLL_RPC_URL`, `SCROLL_SENDER_ADDRESS`, and `SCROLL_PRIVATE_KEY` environment variables specified in your `.env` file.

#### Deploying to Linea Testnet

To deploy the CateringEscrow contract to the Linea Testnet, use the following command:

```bash
make deploy-linea
```

This will use the `LINEA_RPC_URL`, `LINEA_SENDER_ADDRESS`, and `LINEA_PRIVATE_KEY` environment variables specified in your `.env` file.

#### Deploying to BNB Testnet

To deploy the CateringEscrow contract to the BNB Testnet, use the following command:

```bash
make deploy-bnb
```

Ensure that you have set the correct RPC URL and private key in your `.env` file.

#### Custom Deployment

For custom deployments using different networks or configurations, you can use the generic `deploy` command by setting environment variables at runtime:

```bash
RPC_URL=<Your-RPC-URL> SENDER_ADDRESS=<Your-Sender-Address> PRIVATE_KEY=<Your-Private-Key> make deploy
```

#### Deploying to All Supported Testnets

To deploy the contract to all configured testnets use:

```bash
make deploy-all
```

This will sequentially deploy the contract to each testnet using the configurations specified in the `.env` file.

## Verifying Deployed Contracts

After deploying the smart contracts, you can verify and inspect them using block explorers for each network. Below are the steps to verify your deployment:

### 1. BNB Testnet

For contracts deployed on the BNB Testnet, you can use the BscScan block explorer for the testnet. Follow these steps:

1. Visit [BscScan Testnet](https://testnet.bscscan.com/).
2. Enter your deployed contract address (e.g., `0x624669da92762546073a8B00579835216F5FD4B4`) in the search bar.
3. You will be able to see transaction details, contract code (if verified), events, and other information.

### 2. Scroll Sepolia Testnet

For contracts deployed on the Scroll Sepolia Testnet:

1. Visit [Scroll Sepolia](https://sepolia.scrollscan.com).
2. Enter your deployed contract address (e.g., `0x624669da92762546073a8B00579835216F5FD4B4`) in the search bar.
3. You will be able to see transaction details, contract code (if verified), events, and other information.

### 3. Linea Testnet

For contracts deployed on the Linea Testnet:

1. Check if Linea has a dedicated testnet explorer (consult Linea documentation for the latest updates).
2. Enter your contract address to inspect deployment status and interaction logs.

### 4. Other Testnets (NERO, METAL2, BASE)

For other testnets such as NERO, METAL2, and BASE, use the appropriate block explorer provided by each network's documentation. Ensure to replace `<Contract-Address>` with the actual address where your contract was deployed:

- **NERO Testnet Explorer**: [NERO Testnet Explorer](https://explorer.nero.org) (URL is a placeholder; verify the actual URL)
- **METAL2 Testnet Explorer**: [METAL2 Testnet Explorer](https://explorer.metal2.com) (URL is a placeholder)
- **BASE Testnet Explorer**: [BASE Testnet Explorer](https://explorer.base.org) (URL is a placeholder)

## Notes

- It is a good practice to verify the contract's source code on these explorers to provide transparency and ensure trustworthiness.
- Always double-check the network settings (RPC URL, Chain ID) and ensure you are connected to the correct testnet or mainnet before deploying or interacting with the contract.
- Make sure to check gas fees and network activity before deploying on mainnet to ensure cost efficiency.
- Double-check the private key management and security protocols to prevent unauthorized access to your accounts.
