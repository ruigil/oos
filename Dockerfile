#comment
FROM node:latest

ENV HOME=/oos
ENV NODE_ENV production

#RUN apk update && apk upgrade
#RUN apk add --no-cache sqlite~=3.38.5-r0

COPY client/dist $HOME
COPY server/dist $HOME/server
COPY server/node_modules $HOME/node_modules

VOLUME $HOME/db

WORKDIR $HOME

EXPOSE 3000/tcp

CMD ["node", "server/main"]