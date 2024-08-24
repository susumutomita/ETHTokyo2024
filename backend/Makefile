.PHONY: deploy deploy-scroll deploy-nero deploy-linea deploy-metal2 deploy-base deploy-all

# Load environment variables from .env file
include .env
export $(shell sed 's/=.*//' .env)

# Deployment settings with the ability to override from the command line
RPC_URL ?= $(SEPOLIA_RPC_URL)
SENDER_ADDRESS ?= $(SEPOLIA_SENDER_ADDRESS)
PRIVATE_KEY ?= $(SEPOLIA_PRIVATE_KEY)

# Deploy to Scroll Sepolia Testnet
deploy-scroll:
	forge script script/CateringEscrow.s.sol:CateringEscrowScript --rpc-url $(SCROLL_RPC_URL) --broadcast --sender $(SCROLL_SENDER_ADDRESS) --private-key $(SCROLL_PRIVATE_KEY)

# Deploy to NERO Testnet
deploy-nero:
	forge script script/CateringEscrow.s.sol:CateringEscrowScript --rpc-url $(NERO_RPC_URL) --broadcast --sender $(NERO_SENDER_ADDRESS) --private-key $(NERO_PRIVATE_KEY)

# Deploy to Linea Testnet
deploy-linea:
	forge script script/CateringEscrow.s.sol:CateringEscrowScript --rpc-url $(LINEA_RPC_URL) --broadcast --sender $(LINEA_SENDER_ADDRESS) --private-key $(LINEA_PRIVATE_KEY)

# Deploy to METAL2 Testnet
deploy-metal2:
	forge script script/CateringEscrow.s.sol:CateringEscrowScript --rpc-url $(METAL2_TEST_RPC_URL) --broadcast --sender $(METAL2_SENDER_ADDRESS) --private-key $(METAL2_PRIVATE_KEY)

# Deploy to BASE Testnet
deploy-base:
	forge script script/CateringEscrow.s.sol:CateringEscrowScript --rpc-url $(BASE_TEST_RPC_URL) --broadcast --sender $(BASE_SENDER_ADDRESS) --private-key $(BASE_PRIVATE_KEY)

# Deploy to BNB Testnet
deploy-bmb:
	forge script script/CateringEscrow.s.sol:CateringEscrowScript --rpc-url $(BNB_TEST_RPC_URL) --broadcast --sender $(BNB_SENDER_ADDRESS) --private-key $(BNB_PRIVATE_KEY)

# Custom deployment using environment variables specified at runtime
deploy:
	forge script script/CateringEscrow.s.sol:CateringEscrowScript --rpc-url $(RPC_URL) --broadcast --sender $(SENDER_ADDRESS) --private-key $(PRIVATE_KEY)

# Deploy to all supported testnets
deploy-all: deploy-scroll deploy-nero deploy-linea 	deploy-bmb
