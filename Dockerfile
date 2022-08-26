#comment
FROM node

ENV HOME=/oos
ENV NODE_ENV production

VOLUME ["/oos/db"]
EXPOSE 3000/tcp

COPY client/dist $HOME
COPY server/dist $HOME/server
COPY server/package*.json $HOME/server

WORKDIR $HOME/server
run npm ci

WORKDIR $HOME

CMD ["node", "server/main"]