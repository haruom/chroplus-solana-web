FROM node:20-alpine

WORKDIR /app

RUN apk update
RUN apk add openjdk11
RUN apk add bash
RUN apk add --no-cache build-base libusb-dev linux-headers eudev-dev
RUN apk add --no-cache python3 py3-pip
RUN npm install -g firebase-tools@13.6.1
