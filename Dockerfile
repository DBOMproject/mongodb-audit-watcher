FROM node:14-alpine
WORKDIR /usr/src/app

COPY src/package*.json ./
RUN npm ci

COPY src .
ENTRYPOINT [ "node", "app" ]
