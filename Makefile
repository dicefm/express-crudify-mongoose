default: build

.PHONY: build run

cleanup:
	rm -rf ./build


build:
	npm run build

run:
	DEBUG=crudify* npm run test:watch

example-babel:
	DEBUG=crudify* nodemon ./examples/babel

setup:
	npm install
