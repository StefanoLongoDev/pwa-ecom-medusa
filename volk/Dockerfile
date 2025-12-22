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
RUN echo "Building Medusa with BACKEND_URL: $MEDUSA_BACKEND_URL" && \
    yarn build && \
    echo "Build complete. Checking admin build:" && \
    ls -la .medusa/admin/ || echo "ERROR: Admin folder not created!"

# Verify admin was built correctly
RUN test -f .medusa/admin/index.html || (echo "FATAL: Admin index.html not found!" && exit 1)

# Expose Medusa port
EXPOSE 9000

# Use tini for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Make start script executable and start
RUN chmod +x start.sh
CMD ["./start.sh"]
