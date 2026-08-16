# Sunucuda yalnızca bu klasör yeterli:
#   docker compose up --build
#   docker build -t harjs-design .
#   docker run --rm -p 3000:3000 harjs-design
#
# src/ ve kütüphane bağımlılıkları image içinde GitHub main'den gelir.

FROM node:22-alpine AS builder
RUN apk add --no-cache git libc6-compat

ARG REPO=https://github.com/kaancetin-f/harjs-design-react-ui.git
ARG BRANCH=main
RUN git clone --depth 1 --branch "${BRANCH}" "${REPO}" /app
WORKDIR /app

# Bu build context (sunucudaki docs/) klonlanan docs'un üzerine yazılır.
COPY . ./docs

# Kök: src'in paketleri (/app/node_modules). Docs: Next ve site paketleri.
RUN npm ci --omit=dev && npm ci --prefix docs

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

COPY --from=builder --chown=nextjs:nodejs /app/docs/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/docs/.next/static ./docs/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/docs/public ./docs/public

USER nextjs
EXPOSE 3000
CMD ["node", "docs/server.js"]
