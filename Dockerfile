FROM node:lts-alpine

RUN apk update

#RUN yarn add global @vue/cli

WORKDIR /srv/app
#ADD package.json package.json
#RUN npm install

#ENTRYPOINT ["/bin/sh", "-c", "yarn install && yarn run serve"]