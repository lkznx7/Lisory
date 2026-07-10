# ============================
# Lisory Frontend — Dockerfile
# Multi-stage build: Node → Production
# ============================

# --- Stage 1: Dependencies + Build ---
FROM node:22-alpine AS deps
WORKDIR /app

ARG NEXT_PUBLIC_API_URL=https://lisory.com.br
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Stage 2: Production ---
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production

# Non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=deps /app/.next/standalone ./
COPY --from=deps /app/.next/static ./.next/static
COPY --from=deps /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
