.PHONY: install
install:
	npm install

.PHONY: install_all
install_all:
	npm run install-all

.PHONY: setup_husky
setup_husky:
	npm run prepare

.PHONY: clean
clean:
	npm run clean

.PHONY: lint
lint:
	npm run lint

.PHONY: gas
gas:
	npm run gas

.PHONY: format
format:
	npm run format

.PHONY: format_check
format_check:
	npm run format:check

.PHONY: format_contract
format_contract:
	npm run format:contract

.PHONY: test_contract
test_contract:
	npm run test:contract

.PHONY: before_commit
before_commit: lint gas format_contract	format_check	test_contract

.PHONY: start_frontend
start_frontend:
	cd frontend && npm run dev

.PHONY: start
start:
	npx concurrently "make start_frontend"

.PHONY: build_backend
build_backend:
	cd backend && forge build

.PHONY: export_pdf
export_pdf:
	npx marp pitch_deck.md --pdf --allow-local-files --html

.PHONY: help
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  install         Install npm packages"
	@echo "  install_all     Run npm install-all"
	@echo "  export_pdf			Export pitch deck to PDF"
	@echo "  setup_husky     Setup Husky"
	@echo "  clean           Clean the project"
	@echo "  lint            Run linter"
	@echo "  gas             Run gas reporter"
	@echo "  format_contract Format contract"
	@echo "  test_contract   Test contract"
	@echo "  before_commit   Run checks before commit"
	@echo "  start_frontend  Start frontend"
	@echo "  start           Start frontend"
	@echo "  build_backend   Build backend contracts with Forge"
	@echo "  help            Show this help message"
