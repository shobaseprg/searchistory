FROM node:14.16.1

RUN apt update -y && \
  apt upgrade -y && \
  npm install -g @vue/cli @vue/cli-service-global

EXPOSE 3000
