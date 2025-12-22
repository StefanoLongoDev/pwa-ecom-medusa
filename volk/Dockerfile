# Medusa Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++ tini

# Copy package files
COPY package.json yarn.lock ./

# Install ALL dependencies (including devDependencies for admin build)
RUN yarn install --frozen-lockfile

# Copy all source code
COPY . .

# Build backend and admin explicitly
RUN yarn build
RUN ls -la .medusa/ || echo "No .medusa folder"
RUN ls -la .medusa/admin/ || echo "No admin folder - building admin..."

# Expose Medusa port
EXPOSE 9000

# Use tini for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Make start script executable and start
RUN chmod +x start.sh
CMD ["./start.sh"]
