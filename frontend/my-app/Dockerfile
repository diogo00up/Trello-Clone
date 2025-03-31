# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the app for production
RUN npm run build

# Expose the port your app will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
