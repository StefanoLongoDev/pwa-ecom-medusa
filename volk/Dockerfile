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

# Build arguments for admin dashboard
ARG MEDUSA_BACKEND_URL=http://localhost:9000
ARG MEDUSA_ADMIN_BACKEND_URL=http://localhost:9000

# Set environment variables for the build
ENV MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL
ENV MEDUSA_ADMIN_BACKEND_URL=$MEDUSA_ADMIN_BACKEND_URL

# Build backend and admin
RUN yarn build

# Verify admin was built correctly (path: .medusa/server/public/admin/)
RUN test -f .medusa/server/public/admin/index.html || (echo "FATAL: Admin not built!" && exit 1)

# Install production dependencies in the server build directory
RUN cd .medusa/server && yarn install --frozen-lockfile

# Expose Medusa port
EXPOSE 9000

# Use tini for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Make start script executable and start
RUN chmod +x start.sh
CMD ["./start.sh"]
