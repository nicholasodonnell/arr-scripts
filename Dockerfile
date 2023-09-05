FROM node:18-buster-slim AS base

# default environment variables
ENV \
  DEBIAN_FRONTEND=noninteractive \
  NODE_ENV=development \
  TZ=UTC

RUN \
  # add dependencies
  apt-get update \
  && apt-get install -y \
    tzdata \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# root
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

# apps
COPY apps/mirrar/package.json ./apps/mirrar/package.json

# packages
COPY packages/config/package.json ./packages/config/package.json
COPY packages/filesystem/package.json ./packages/filesystem/package.json
COPY packages/logger/package.json ./packages/logger/package.json
COPY packages/radarr/package.json ./packages/radarr/package.json
COPY packages/util/package.json ./packages/util/package.json

RUN npm ci && npm cache clean --force

##############################

FROM base AS build

ENV NODE_ENV=production

COPY . ./

RUN npm run build

##############################

FROM base AS production

ENV NODE_ENV=production

# root
COPY --from=build /app/node_modules ./node_modules

# apps
COPY --from=build /app/apps/mirrar/dist ./apps/mirrar

# packages
COPY --from=build /app/packages/filesystem/dist ./packages/filesystem/src
COPY --from=build /app/packages/logger/dist ./packages/logger/src
COPY --from=build /app/packages/radarr/dist ./packages/radarr/src
COPY --from=build /app/packages/util/dist ./packages/util/src

ENTRYPOINT [ "npm", "run" ]
