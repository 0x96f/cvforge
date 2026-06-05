FROM node:24-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@10.30.3 --activate && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable && corepack prepare pnpm@10 --activate && pnpm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 sveltekit

COPY --from=builder --chown=sveltekit:nodejs /app/build ./build
COPY --from=builder --chown=sveltekit:nodejs /app/static ./static
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

USER sveltekit

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", "build"]
