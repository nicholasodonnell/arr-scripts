<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./images/banner-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="./images/banner-light.png">
  <img src="./images/banner-dark.png">
</picture>

[![CD](https://github.com/nicholasodonnell/arr-scripts/actions/workflows/cd.yml/badge.svg)](https://github.com/nicholasodonnell/arr-scripts/actions/workflows/cd.yml)

## Scripts

### [Mirrarr](./apps/mirrarr)

Symlinks movies based on your Radarr lists & tags. Useful for creating Plex libraries that mirror your Radarr instance.

For example, you could create a Plex library that only contains movies that are tagged "Kids" in Radarr.

### [Tagarr](./apps/tagarr)

Add tags to movies according to list membership. Currently, Radarr will only tag movies based on the first list they were imported from. This script will tag movies based on all lists they are in.

For example, if you have a list called "Kids" and a list called "Popular" both which contain the same movie, you can tag the movie in Radarr with tags from both lists.
