FROM node:16.13.1
LABEL org.opencontainers.image.source https://github.com/arquisoft/dede_en2a
COPY . /app
WORKDIR /app
#Install the dependencies
RUN npm install

ARG API_URI
ENV REACT_APP_API_URI=$env:API_URI

ARG MAPBOX_KEY
ENV REACT_APP_MAPBOY_KEY=$env:MAPBOX_KEY

ARG BING_KEY
ENV REACT_APP_BING_KEY=$env:BING_KEY

ARG PAYPAL_CLIENT_ID
ENV REACT_APP_PAYPAL_CLIENT_ID=$env:PAYPAL_CLIENT_ID

#Create an optimized version of the webapp
RUN npm run build

#Ver como podemos llamar npm run prod aquí
CMD [ "npm", "run", "prod" ]