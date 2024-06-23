FROM mcr.microsoft.com/devcontainers/typescript-node:18-bookworm
# Install the xz-utils package
RUN apt-get update && apt-get install -y xz-utils python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN npm install balena-cli --global --production --unsafe-perm