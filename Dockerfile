#########################
# multi stage Dockerfile
# 1. set up the build environment and build the expath-package
# 2. run the eXist-db
#########################
FROM node:lts as builder

WORKDIR /app

COPY . .
RUN npm install \
  && npm run build


#########################
# nginx for serving the app
#########################
FROM nginx:alpine
LABEL maintainer="Johannes Kepper for Beethovens Werkstatt"
COPY --from=builder /app/dist/* /usr/share/nginx/html
