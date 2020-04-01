FROM node:10-slim

LABEL maintainer="shipyardsuite@gmail.com"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app/
RUN npm install

ARG CACHEBUST=1
CMD [ "npm", "start" ]