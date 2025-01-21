ARG NODE_VERSION=20.3.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Remix"

# Remix app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"
ENV PORT="3000"

# Install necessary packages
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl sqlite3

# Throw-away build stage to reduce size of final image
FROM base as build

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN $SENTRY_AUTH_TOKEN

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential sqlite3 node-gyp pkg-config python-is-python3 python3-pip

ENV PYTHON=/usr/bin/python3

# Install node modules
COPY --link package.json package-lock.json ./
RUN npm install

# Copy application code
COPY --link . .

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Final stage for app image
FROM base

# Install necessary packages
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
ENTRYPOINT [ "./start.sh" ]
