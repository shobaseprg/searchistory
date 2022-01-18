FROM node:14.16.1

RUN apt update -y && \
  npm install -g @vue/cli

EXPOSE 3000
