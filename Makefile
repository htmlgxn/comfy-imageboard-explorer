.PHONY: docker-build docker-run docker-compose docker-down docker-clean

docker-build:
	docker build -t imageboard-explorer .

docker-run:
	docker run -p 8000:8000 imageboard-explorer

docker-compose:
	docker compose up --build

docker-down:
	docker compose down

docker-clean:
	-docker image rm imageboard-explorer
