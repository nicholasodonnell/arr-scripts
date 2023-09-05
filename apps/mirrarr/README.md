# Mirrarr

## Usage

> :exclamation: Be sure to mount `/path/to/radarr/root/folder` in the below example with your Radarr root folder(s). The path on the host should match the path in the container.

> :exclamation: Be sure to replace `/path/to/destination` in the below example with a valid host directory path. The path on the host should match the path in the container.

> :exclamation: The `TZ` environment variable value should be set to the [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) of your time zone.

```bash
docker run --rm \
  -e TZ=America/New_York \
  -v /path/to/radarr/root/folder:/path/to/radarr/root/folder \
  -v /path/to/destination:/path/to/destination \
  nicholasodonnell/arr-scripts:latest \
  mirrarr -- \
    --radarrUrl=http://[radarr-address]:[radarr-port] \
    --radarrApiKey=[radarr-api-key] \
    --destination=/path/to/destination
```

#### Options

| Option           | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| `--radarrUrl`    | **(required)** The URL of your Radarr instance.                |
| `--radarrApiKey` | **(required)** The API key of your Radarr instance.            |
| `--destination`  | **(required)** The destination directory to symlink movies to. |
| `--chmod`        | The permissions to set on the symlinked movies.                |
| `--puid`         | The user ID to set on the symlinked movies.                    |
| `--pgid`         | The group ID to set on the symlinked movies.                   |
