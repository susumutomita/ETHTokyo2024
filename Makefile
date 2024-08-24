.PHONY: install setup_husky clean lint gas format format_check format_contract test_contract before_commit build_frontend start build_backend export_pdf help

# Installation and Setup
install:           # Install npm packages
	npm install

setup_husky:      # Setup Husky for git hooks
	npm run prepare

# Code Quality and Formatting
clean:             # Clean the project
	npm run clean

lint:              # Run linter
	npm run lint

format:            # Format code
	npm run format

format_check:      # Check code formatting
	npm run format:check

format_contract:   # Format smart contracts
	npm run format:contract

# Testing
test_contract:     # Test smart contracts
	npm run test:contract

# Gas Report
gas:               # Run gas reporter
	npm run gas

# Build and Deployment
build_frontend:    # Build the frontend
	cd frontend && npm run build

build_backend:     # Build backend contracts with Forge
	cd backend && forge build

start:             # Start the frontend
	npx concurrently "make start_frontend"

start_frontend:    # Build the frontend
	cd frontend && npm run dev

# Export Documentation
export_pdf:        # Export pitch deck to PDF using Marp
	npx marp pitch_deck.md --pdf --allow-local-files --html

# Pre-commit Checks
before_commit: lint	gas	format	format_contract	format_check	test_contract	build_frontend	build_backend

# Help
help:              # Show this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  install         Install npm packages"
	@echo "  setup_husky     Setup Husky for git hooks"
	@echo "  clean           Clean the project"
	@echo "  lint            Run linter"
	@echo "  format          Format code"
	@echo "  format_check    Check code formatting"
	@echo "  format_contract Format smart contracts"
	@echo "  test_contract   Test smart contracts"
	@echo "  gas             Run gas reporter"
	@echo "  build_frontend  Build the frontend"
	@echo "  build_backend   Build backend contracts with Forge"
	@echo "  start           Start the frontend"
	@echo "  export_pdf      Export pitch deck to PDF using Marp"
	@echo "  before_commit   Run checks before commit"
	@echo "  help            Show this help message"
