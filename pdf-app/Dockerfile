# Dockerfile for pdf-app
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install --production

# Copy the Azure Blob watcher script
COPY azure-blob-index.js ./

# Create output directory at runtime
RUN mkdir -p /app/output

# Create a non-root user and group
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Set permissions for output directory
RUN chown -R appuser:appuser /app /app/output || true

# Switch to non-root user
USER appuser

# Start the watcher script for Azure Blob Storage
CMD ["node", "azure-blob-index.js"]
