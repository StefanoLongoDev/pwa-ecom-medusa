# Dockerfile for both development and production
FROM node:20-alpine

# Set working directory
WORKDIR /server

# Copy only package.json and install dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Expose Medusa port
EXPOSE 9000

# Start Medusa server
CMD ["./start.sh"]
