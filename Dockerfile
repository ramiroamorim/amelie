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
RUN npm ci --omit=dev

# Copiar build gerado do stage anterior (inclui dist/index.js e dist/public)
COPY --from=builder /app/dist ./dist

# Copiar pasta public original (para arquivos de áudio, etc)
COPY --from=builder /app/public ./public

# Copiar attached_assets se existir
COPY --from=builder /app/attached_assets ./attached_assets

# Expor porta (padrão Express)
EXPOSE 5000

# Variável de ambiente
ENV NODE_ENV=production
ENV PORT=5000

# Comando para iniciar a aplicação
CMD ["node", "dist/index.js"]
