FROM node:6.3.0

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app/

WORKDIR /usr/src/app

EXPOSE 3000

ENTRYPOINT ["npm"]
CMD ["start"]
