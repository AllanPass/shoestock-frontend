FROM node:18-slim

WORKDIR /usr/src/app

# Instalar dependências do sistema
RUN apt-get update -y && \
    apt-get install -y openssl curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm install -g prisma && \
    npm cache clean --force

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy rest of the application
COPY . .

# Create non-root user
RUN adduser --disabled-password --gecos "" nodeuser && \
    chown -R nodeuser:nodeuser /usr/src/app

USER nodeuser

EXPOSE 3001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/api/status || exit 1

CMD ["npm", "run", "server"]
