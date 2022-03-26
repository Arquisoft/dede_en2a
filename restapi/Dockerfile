FROM node:16.13.1
LABEL org.opencontainers.image.source https://github.com/arquisoft/dede_en2a
COPY . /app
WORKDIR /app
#Install the dependencies
RUN npm install

ARG PORT
ENV PORT=$PORT

ARG MONGO_DB_URI
ENV MONGO_DB_URI = $MONGO_DB_URI

ARG NODE_ENV
ENV NODE_ENV = $NODE_ENV

ARG JWT_SECRET
ENV JWT_SECRET = $JWT_SECRET

ARG AUTH_EMAIL
ENV AUTH_EMAIL = $AUTH_EMAIL

ARG AUTH_PASS
ENV AUTH_PASS = $AUTH_PASS

CMD [ "npm", "start" ]