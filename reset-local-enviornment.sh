#!/bin/bash

docker images -aq | xargs docker rmi -f
docker ps -aq | xargs docker rm -f

curl -sSL https://hyperledger.github.io/composer/install-hlfv1.sh | bash
