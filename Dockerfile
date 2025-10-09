# Lightweight Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only dependency files first (to leverage Docker cache)
COPY Code/walleto/package*.json ./

# Install only production dependencies, skip optional stuff
RUN npm install --omit=dev --no-audit --no-fund

# Copy the rest of the project
COPY Code/walleto/ .

# Expose the Next.js dev port (change if different)
EXPOSE 3000

# Start command
CMD ["npm", "run", "dev"]
