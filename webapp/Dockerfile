FROM node:16.13.1
LABEL org.opencontainers.image.source https://github.com/pglez82/ASW2122_0
COPY . /app
WORKDIR /app
#Install the dependencies
RUN npm install

#Create an optimized version of the webapp
RUN npm run build

#Ver como podemos llamar npm run prod aquí
CMD [ "npm", "run", "prod" ]