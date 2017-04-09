.PHONY: build_react clean_react build_go clean_go build clean

all: build

build_react:
	cd app; \
	npm run build;

clean_react:
	cd app; \
	rm -rf build;

build_go:
	go build;

clean_go:
	go clean;

build: build_react build_go

clean: clean_react clean_go
