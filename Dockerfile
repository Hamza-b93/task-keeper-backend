# Use a Node.js base image
FROM node:latest

# Install Volta (make sure to use the latest installation script from https://get.volta.sh)
RUN curl https://get.volta.sh | bash

# Set the working directory inside the container
WORKDIR /task-keeper-backend

# Copy the entire project directory into the container
COPY . .

# Activate Volta environment
SHELL ["/bin/bash", "-c"]
ENV VOLTA_HOME="/root/.volta"
ENV PATH="$VOLTA_HOME/bin:$PATH"

# Install Volta's shim to manage Node.js versions
RUN /root/.volta/bin/volta setup

# Set the Node.js version you want to use (replace `x.x.x` with your desired version)
RUN volta install node@latest

# Copy package.json and package-lock.json to container
COPY package*.json ./

# Set the default Node.js version to be used
RUN volta pin node@latest

# Install dependencies
RUN npm install
RUN npm install fastify-cli --global

# Expose the port your app runs on
EXPOSE 3000
EXPOSE 27017

# Command to run your application using host networking stack with a specific container name
CMD ["fastify", "start", "-a", "0.0.0.0", "app.js", "--", "--network=host", "--name=task-keeper-backend"]
# CMD ["fastify", "start", "-a", "0.0.0.0", "app.js", "--name=gametrades-backend"]