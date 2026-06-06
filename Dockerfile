# ---- Build stage: install all deps and build the Vite app ----
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies (including devDependencies needed for the Vite/TS build)
COPY package*.json ./
RUN npm install

# Build the app -> dist/
COPY . .
RUN npm run build

# ---- Runtime stage: production deps + built assets + server ----
FROM node:18-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Only production dependencies for the Express server
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy the built frontend and the server
COPY --from=builder /app/dist ./dist
COPY server.js ./

EXPOSE 3000

CMD ["npm", "start"]
