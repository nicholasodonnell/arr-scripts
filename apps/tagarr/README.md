# Tagarr

## Usage

> :exclamation: The `TZ` environment variable value should be set to the [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) of your time zone.

```bash
docker run --rm \
  -e TZ=America/New_York \
  nicholasodonnell/arr-scripts:latest \
  tagarr -- \
    --radarrUrl=http://[radarr-address]:[radarr-port] \
    --radarrApiKey=[radarr-api-key]
```

#### Options

| Option           | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| `--radarrUrl`    | **(required)** The URL of your Radarr instance.                |
| `--radarrApiKey` | **(required)** The API key of your Radarr instance.            |
