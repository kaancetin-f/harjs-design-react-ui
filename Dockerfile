# Docs site. Build from the repo root:
#   docker build -t harjs-design .
#   docker run --rm -p 3000:3000 harjs-design

FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY docs/package.json docs/package-lock.json ./docs/
RUN npm ci --prefix docs

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/docs/node_modules ./docs/node_modules
COPY src ./src
COPY docs ./docs
WORKDIR /app/docs
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Tracing root is the repo, so standalone keeps a `docs/` prefix.
COPY --from=builder --chown=nextjs:nodejs /app/docs/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/docs/.next/static ./docs/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/docs/public ./docs/public

USER nextjs
EXPOSE 3000
CMD ["node", "docs/server.js"]
