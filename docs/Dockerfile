# Build from the docs folder (no local `src/` required):
#   docker compose up --build
#   docker build -t harjs-design .
#   docker run --rm -p 3000:3000 harjs-design

FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./docs/
RUN npm ci --prefix docs

FROM node:22-alpine AS builder
RUN apk add --no-cache git
WORKDIR /app
COPY --from=deps /app/docs/node_modules ./docs/node_modules

# Docs demos import the library from ../src. Fetch it from main.
ARG REPO=https://github.com/kaancetin-f/harjs-design-react-ui.git
ARG BRANCH=main
RUN git clone --depth 1 --branch "${BRANCH}" "${REPO}" /tmp/harjs \
  && mv /tmp/harjs/src /app/src \
  && rm -rf /tmp/harjs

COPY . ./docs
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
