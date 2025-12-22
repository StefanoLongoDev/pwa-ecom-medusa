# Medusa Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++ tini

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy all source code
COPY . .

# Build the application
RUN yarn build

# Make start script executable
RUN chmod +x start.sh

# Expose Medusa port
EXPOSE 9000

# Use tini for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Start Medusa server
CMD ["./start.sh"]
