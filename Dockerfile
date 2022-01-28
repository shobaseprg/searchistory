FROM node:14.16.1

RUN apt update -y && \
  npm install -g @vue/cli

COPY vue.config.js .

EXPOSE 3000
