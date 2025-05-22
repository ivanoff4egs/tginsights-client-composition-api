FROM node:lts-alpine

RUN apk update

WORKDIR /srv/app
ADD package.json package.json
RUN npm install

ENTRYPOINT ["/bin/sh", "-c", "npm run dev -- --host 0.0.0.0 --port 8081"]