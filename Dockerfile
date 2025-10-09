# Use the official Node.js 18 image
#FROM node:18-alpine

# Set working directory inside container
#WORKDIR /app

# Copy package files first to leverage Docker cache
#COPY Code/walleto/package*.json ./

# Install dependencies
#RUN npm install

# Copy the rest of your app source code
#COPY Code/walleto .

# Expose the port Next.js uses
#EXPOSE 3000

# Run the app
#CMD ["npm", "run", "dev"]



FROM node:18-alpine
WORKDIR /app
COPY Code/walleto/package*.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY Code/walleto/ .
EXPOSE 3000
CMD ["npm", "start"]
