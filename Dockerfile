# Use the official Node.js image as a base
FROM node:18-alpine as base

# Set the working directory
WORKDIR /app

# Install dependencies only once in a layer
FROM base as deps
COPY package.json package-lock.json ./
RUN npm install --production=false

# Build the Prisma client
FROM base as prisma
COPY prisma ./prisma
COPY --from=deps /app/node_modules ./node_modules
RUN npx prisma generate

# Build the Remix app
FROM base as build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Final stage: runtime image
FROM node:18-alpine as runtime

# Set environment variables
ENV NODE_ENV=production
WORKDIR /app

# Copy necessary files
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
COPY --from=build /app/package.json .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=prisma /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=prisma /app/prisma ./prisma

# Expose the port Remix uses
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]

