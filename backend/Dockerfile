# ==========================================
# Stage 1: Base
# ==========================================
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
WORKDIR /app

# ==========================================
# Stage 2: Dependencies
# ==========================================
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ==========================================
# Stage 3: Build
# ==========================================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
RUN pnpm run build

# ==========================================
# Stage 4: Production Runtime
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

USER nodejs
EXPOSE 8000
ENV NODE_ENV=production
ENV PORT=8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))" || exit 1

CMD ["node", "dist/index.js"]