#!/bin/bash

docker images -aq | xargs docker rmi -f
docker ps -aq | xargs docker rm -f

rm -rf composer.sh composer-data composer-logs/

rm -rf node_modules

curl -sSL https://hyperledger.github.io/composer/install-hlfv1.sh | bash
