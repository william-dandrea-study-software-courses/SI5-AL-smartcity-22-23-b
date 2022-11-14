#!/usr/bin/env sh

cd project || exit

docker-compose --project-name smartcity-prod --file ./docker-compose-prod.yml build --parallel
docker-compose --project-name smartcity-prod --file ./docker-compose-prod.yml up -d