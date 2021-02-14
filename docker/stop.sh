#!/bin/bash

dt=$(date '+%d-%m-%Y');
docker logs appstore-registry > ./logs/$dt.log
docker stop appstore-registry > /dev/null
docker rm appstore-registry > /dev/null