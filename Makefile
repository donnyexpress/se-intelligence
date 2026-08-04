.PHONY: dev serve build build-mobile clean deploy zip test test-setup help

# Manager's Playbook — common tasks
# Use `make help` to see all options

help:
	@echo "Manager's Playbook — make targets:"
	@echo "  make dev          Start dev server on http://localhost:8000"
	@echo "  make serve        Same as dev (alias)"
	@echo "  make build-mobile Build single-file mobile version"
	@echo "  make test         Run end-to-end smoke tests (needs server on :8000)"
	@echo "  make test-setup   Install puppeteer for tests"
	@echo "  make clean        Remove built mobile file"
	@echo "  make zip          Create deployable zip"

dev:
	./scripts/dev.sh 8000

serve: dev

build-mobile:
	node scripts/build-mobile.js

clean:
	rm -f playbook-mobile.html

zip:
	zip -r managers-playbook.zip . -x "*.zip" "node_modules/*" ".git/*"

test-setup:
	@echo "Installing puppeteer (one-time)..."
	@npm install --no-save puppeteer 2>&1 | tail -3

test:
	@if ! curl -s -o /dev/null http://localhost:8000/; then \
		echo ""; \
		echo "  ✗ No server running on :8000"; \
		echo "    Run 'make dev' in another terminal first."; \
		echo ""; \
		exit 1; \
	fi
	@node scripts/test.js

test-headed:
	@node scripts/test.js --headed
