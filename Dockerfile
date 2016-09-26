FROM node:6.3.0
MAINTAINER Jeff Dickey <dickeyxxx@gmail.com>

# Deploy application
COPY . /srv/npm-register
WORKDIR /srv/npm-register
RUN npm install

# Start application
EXPOSE 80
CMD ["npm", "start"]

