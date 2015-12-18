default: build

.PHONY: build run

cleanup:
	rm -rf ./build


build:
	npm run build

run:
	DEBUG=crudify* npm run test:watch

express:
	DEBUG=crudify* nodemon ./examples/express

setup:
	npm install
