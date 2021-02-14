FROM node:12-alpine

# Adding source files into container
ADD src/ /src

# Define working directory
WORKDIR /src

# Install app dependencies
RUN npm install

# Open Port 5500
EXPOSE 5500

# Run Node.js
CMD ["node", "index.js"]