#comment
FROM node:alpine

ENV HOME=/oos
ENV NODE_ENV production

RUN apk update && apk upgrade
RUN apk add --no-cache sqlite~=3.38.5-r0

COPY client/dist $HOME
COPY server/dist $HOME/server
COPY server/package*.json $HOME/server

WORKDIR $HOME/server
run npm ci

WORKDIR $HOME

VOLUME $HOME/db

EXPOSE 3000/tcp

CMD ["node", "server/main"]