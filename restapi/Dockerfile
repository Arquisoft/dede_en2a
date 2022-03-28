FROM node:16.13.1
LABEL org.opencontainers.image.source https://github.com/arquisoft/dede_en2a
COPY . /app
WORKDIR /app
#Install the dependencies
RUN npm install

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

CMD [ "npm", "start" ]