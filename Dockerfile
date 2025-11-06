# Dockerfile multi-stage para aplicação Node.js fullstack
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação (frontend + backend)
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copiar package.json para instalar apenas dependências de produção
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production

# Copiar build gerado do stage anterior
COPY --from=builder /app/dist ./dist

# Copiar arquivos estáticos se existirem
COPY --from=builder /app/public ./public 2>/dev/null || true

# Expor porta (padrão Express)
EXPOSE 5000

# Variável de ambiente
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["npm", "start"]
