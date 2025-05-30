# Use an outdated base image with known vulnerabilities
FROM node:18-bullseye

# Install packages without version pinning or cleanup
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    netcat \
    openssh-server

# Expose environment variables with sensitive data
ENV SECRET_KEY="my_super_secret_key"

# Copy weather app files
COPY app/ /weather-app/app/
COPY components/ /weather-app/components/
COPY lib/ /weather-app/lib/
COPY components.json /weather-app/
COPY next.config.mjs /weather-app/
COPY package.json /weather-app/
COPY postcss.config.mjs /weather-app/
COPY tailwind.config.ts /weather-app/
COPY tsconfig.json /weather-app/

# Set working directory
WORKDIR /weather-app

# Install dependencies and build
RUN npm install --legacy-peer-deps && npm run build

# Run everything as the root user (bad practice)
USER root

# Expose an insecure port
EXPOSE 8080

# Start the Next.js app
CMD ["npm", "start", "--", "-p", "8080"]