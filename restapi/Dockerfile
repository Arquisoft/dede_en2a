FROM node:16.13.1
LABEL org.opencontainers.image.source https://github.com/arquisoft/dede_en2a
COPY . /app
WORKDIR /app
#Install the dependencies
RUN npm install

ENV OPENSSL_CONF=/opt/openssl.cnf

ENV PHANTOMJS_VERSION=2.1.1
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

RUN apk update && apk add --no-cache fontconfig curl curl-dev \ &&
    cd /tmp && curl -Ls https://github.com/dustinblackman/phantomized/releases/download/2.1.1/dockerized-phantomjs.tar.gz | tar xz \ &&
    cp -R lib lib64 / \ && 
    cp -R usr/lib/x86_64-linux-gnu /usr/lib \ &&
    cp -R usr/share /usr/share \ &&
    cp -R etc/fonts /etc \ &&
    curl -k -Ls https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2 | tar -jxf - \ && 
    cp phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs

ARG PORT="5000"
ENV PORT=$PORT

ARG MONGO_DB_URI="Database"
ENV MONGO_DB_URI=$MONGO_DB_URI

ARG NODE_ENV="Development"
ENV NODE_ENV=$NODE_ENV

ARG JWT_SECRET="secretToken"
ENV JWT_SECRET=$JWT_SECRET

ARG AUTH_EMAIL="authemail@email.com"
ENV AUTH_EMAIL=$AUTH_EMAIL

ARG AUTH_PASS="authPass"
ENV AUTH_PASS=$AUTH_PASS

ARG SENDGRID_API_KEY="sendgridapikey"
ENV SENDGRID_API_KEY=$SENDGRID_API_KEY

CMD [ "npm", "start" ]