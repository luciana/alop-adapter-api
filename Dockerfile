FROM node:latest
MAINTAINER Luciana G Bruscino <luciana.bruscino@gmail.com>

# install PM2
RUN npm install pm2 -g

# create directory to hold the application code inside the image
RUN mkdir -p /usr/src/alop-adapter-app

#set the currently active directory
WORKDIR /usr/src/alop-adapter-app

#bundle app's source code inside the Docker image
#COPY . /usr/src/alop-adapter-app
#COPY package*.json ./

ADD . /usr/src/alop-adapter-app

# server.js file binds to port 8081, set EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 8081

# Install app dependencies
RUN npm install
# If building code for production
# RUN npm install --only=production

# Show current folder structure in logs
RUN ls -al -R

# start the app
#CMD ["npm", "start"]
CMD [ "pm2-runtime", "start", "pm2.json" ]