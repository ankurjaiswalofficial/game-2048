# --- Build Stage ---
FROM node:20-alpine AS builder
ARG ROOT_PATH=""
WORKDIR /app

# Install dependencies
COPY  ./package*.json ./
RUN npm ci 

# Copy the rest of the application code
COPY  ${SOURCE_APP_DIR} /app/

# Build the Next.js app
ENV BASE_PATH=${ROOT_PATH}
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

# Set NODE_ENV before installing anything
ENV NODE_ENV=production
ENV PORT=8000

# Copy only necessary files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./next.config.*

# Optional: Copy TypeScript files only if needed by your app at runtime
# COPY --from=builder /app/tsconfig.json ./tsconfig.json
# COPY --from=builder /app/src ./src
# COPY --from=builder /app/app ./app

# Expose port
EXPOSE 8000

# Start the Next.js app
CMD ["npx", "next", "start", "-p", "8000"]
