FROM node:16.13.1
LABEL org.opencontainers.image.source https://github.com/arquisoft/dede_en2a
COPY . /app
WORKDIR /app
#Install the dependencies
RUN npm install

ARG API_URI="http://localhost:5000"
ENV REACT_APP_API_URI=$API_URI

ARG MAPBOX_KEY="MapboxAPIKey"
ENV REACT_APP_MAPBOX_KEY=$MAPBOX_KEY

ARG BING_KEY="BingMapsKey"
ENV REACT_APP_BING_KEY=$BING_KEY

ARG PAYPAL_CLIENT_ID="PaypalCheckoutKey"
ENV REACT_APP_PAYPAL_CLIENT_ID=$PAYPAL_CLIENT_ID

ARG GEOAPIFY_KEY="GeoapifyKey"
ENV REACT_APP_GEOAPIFY_KEY=$GEOAPIFY_KEY

#Create an optimized version of the webapp
RUN npm run build

#Ver como podemos llamar npm run prod aquí
CMD [ "npm", "run", "prod" ]