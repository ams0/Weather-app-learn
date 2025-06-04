# Dockerfile for pdf-app
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install --production

# Copy the rest of the app
COPY index.js ./
COPY pdfs ./pdfs

# Create output directory at runtime
RUN mkdir -p /app/output

# Create a non-root user and group
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Set permissions for output and pdfs folders
RUN chown -R appuser:appuser /app /app/output /app/pdfs || true

# Switch to non-root user
USER appuser

# Expose no ports (not a web server)

# Start the watcher script
CMD ["node", "index.js"]
