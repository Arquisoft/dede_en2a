FROM node:16.13.1
LABEL org.opencontainers.image.source https://github.com/arquisoft/dede_en2a
COPY . /app
WORKDIR /app
#Install the dependencies
RUN npm install

ARG PORT
ENV PORT=$PORT

ARG MONGO_DB_URI
ENV MONGO_DB_URI = $env:MONGO_DB_URI

ARG NODE_ENV
ENV NODE_ENV = $env:NODE_ENV

ARG JWT_SECRET
ENV JWT_SECRET = $env:JWT_SECRET

ARG AUTH_EMAIL
ENV AUTH_EMAIL = $env:AUTH_EMAIL

ARG AUTH_PASS
ENV AUTH_PASS = $env:AUTH_PASS

CMD [ "npm", "start" ]