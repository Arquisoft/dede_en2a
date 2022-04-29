FROM node:16.13.1
LABEL org.opencontainers.image.source https://github.com/arquisoft/dede_en2a
COPY . /app
WORKDIR /app
#Install the dependencies
RUN npm install

ARG CARRIERS_DB_URI="Database"
ENV CARRIERS_DB_URI=$CARRIERS_DB_URI

CMD [ "npm", "start" ]