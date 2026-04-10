# Use a stable Node.js image
FROM node:25.9.0

# Create and set the working directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your frontend code
COPY . .

# Expose the port your Express app listens on
EXPOSE 3000

# Start the application
CMD ["node", "app.js"] 
