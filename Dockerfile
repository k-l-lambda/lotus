FROM ubuntu:22.04

# Set noninteractive installation
ENV DEBIAN_FRONTEND=noninteractive

# Install build dependencies and curl
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    python2 \
    fontconfig

# Download and install Node.js 12.13.0
RUN curl -fsSL https://nodejs.org/dist/v12.13.0/node-v12.13.0-linux-x64.tar.xz | tar -xJ -C /usr/local --strip-components=1

# Create app directory
WORKDIR /app

# Copy the entire project including node_modules
COPY . .

# Remove .env.local if exists
RUN rm -f .env.local

# Set all environment variables
ENV PORT=8130
ENV HOST=0.0.0.0
ENV LILYPOND_DATADIR=/app/node-addon-lilypond/output/share/lilypond/current/
ENV GUILE_LOAD_PATH=/app/node-addon-lilypond/output/share/guile/1.8
ENV LD_LIBRARY_PATH=/app/node-addon-lilypond/output
ENV LILYPOND_ADDON=/app/node-addon-lilypond/output/lilypond.node

# Expose port
EXPOSE 8130

# Start command
CMD ["npm", "start"]
