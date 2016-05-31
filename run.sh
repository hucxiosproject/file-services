#!/bin/bash
source /data/env
eval "$(weave proxy-env)"

docker rm -f file-services
docker build -t file-services .
docker run -d --name file-services \
	-e VIRTUAL_HOST="$FILE_VIRTUAL_HOST" \
	-e MONGO_URL="$FILE_MONGO_URL" \
	-e NEWRELIC_APP_NAME="$FILE_SERVICES_NEWRELIC_APP" \
	-e NEWRELIC_LICENSE_KEY="$FILE_SERVICES_NEWERELIC_LICENSE_KEY" \
	-v /data/volumes/file-services:/data \
	file-services

