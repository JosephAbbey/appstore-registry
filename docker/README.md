# Appstore-Registry Docker

## Build:

```shell
docker build -t appstore-registry .
```

Initialise a database in the "container" directory before running the container. The database must be named "data.json.db" and contain:

```json
{
    "users": [],
    "apps": []
}
```

## Run:

```shell
docker run -dit -p 5500:5500 -P --name appstore-registry -v <path to data dir>:/data appstore-registry
```
