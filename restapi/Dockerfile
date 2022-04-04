FROM node:16.13.1
LABEL org.opencontainers.image.source https://github.com/arquisoft/dede_en2a
COPY . /app
WORKDIR /app
#Install the dependencies
RUN npm install

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        bzip2 \
        libfontconfig \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
    && mkdir /tmp/phantomjs \
    && curl -L https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2 \
           | tar -xj --strip-components=1 -C /tmp/phantomjs \
    && cd /tmp/phantomjs \
    && mv bin/phantomjs /usr/local/bin \
    && cd \
    && apt-get purge --auto-remove -y \
        curl \
    && apt-get clean \
    && rm -rf /tmp/* /var/lib/apt/lists/*
    
# Run as non-root user 
RUN useradd --system --uid 72379 -m --shell /usr/sbin/nologin phantomjs

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