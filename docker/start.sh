#!/bin/bash

{ # try
    cat ./container/data.json.db > /dev/null
    } || { # catch
    echo '''{
        "users": [],
        "apps": []
    }''' > ./container/data.json.db
}
docker run -dit -p 5500:5500 -P --name appstore-registry -v $PWD/container:/data appstore-registry