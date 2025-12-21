# ============================================
# Medusa Backend - Production Dockerfile
# ============================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json yarn.lock ./

# Install all dependencies (including devDependencies for build)
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# ============================================
# Stage 2: Production
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Install only runtime dependencies
RUN apk add --no-cache tini

# Copy package files
COPY package.json yarn.lock ./

# Install production dependencies only
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Copy built application from builder stage
COPY --from=builder /app/.medusa ./.medusa

# Copy necessary config files
COPY medusa-config.ts ./
COPY tsconfig.json ./
COPY start.sh ./

# Make start script executable
RUN chmod +x start.sh

# Create non-root user for security
RUN addgroup -g 1001 -S medusa && \
    adduser -S medusa -u 1001 -G medusa

# Change ownership of app directory
RUN chown -R medusa:medusa /app

# Switch to non-root user
USER medusa

# Expose Medusa port
EXPOSE 9000

# Use tini as init system for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Start Medusa server
CMD ["./start.sh"]
