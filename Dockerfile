# ── Stage 1: Build React client ───────────────────────────────
FROM node:20-alpine AS client-builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# ── Stage 2: Production server ────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copy server code
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

COPY server/ ./server/

# Copy built React app into server/public so Express can serve it
COPY --from=client-builder /app/client/dist ./server/public

# Set environment
ENV NODE_ENV=production
ENV PORT=7860

# Serve the built client from Express in production
WORKDIR /app/server

EXPOSE 7860

CMD ["node", "src/app.js"]
