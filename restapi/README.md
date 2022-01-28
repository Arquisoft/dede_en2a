## Restapi
The objective for this part is to make a rest API using Express and Node.js using TypeScript. We will implement only two functions, one push petition, for registering a new user and a get petition, to list all the users in the system. The webservice will be deployed using docker.

Lets analyze the main packages used in this part (file package.json):
- express: this is the main dependency for building the API. Express is a NodeJS web framework very useful for building API endpoints though it has other applications as well.
- cors: Cross-Origin Resource Sharing, is useful for allowing petitions only from certain domains, in this case, we will allow only petitions from localhost.
- express-validator: useful for validate the input of the API calls. This improves security avoiding code injection attacks.    
- express-prom-bundle and prom-client: middleware to capture the petitions and send statistics to prometheus. This is useful for monitoring the webservice.
- @types packages. Types for coding using typescript.
     
The code is quite straight forward, the [server.ts](server.ts) file launchs the api. The [api.ts](api.ts) is actually the api, where you will see there two api entry points, one post for creating a new user, and one get to list all the users. 

For launching the API we can use `npm start`. This will launch the file `server.ts` using the package `ts-node-dev`. This package is useful for launching Typescript files with the additional feature of being able to reload the server if we change the code.

### Testing the rest api
For testing we need to do simulate petitions against the API. In this case we are using a tool called [Supertest](https://www.npmjs.com/package/supertest).

<mark>Note: These dependencies are save only for dev mode, we do not need them for production.</mark>

The idea is to use Jest (as in the webapp) as the main testing framework. For making the get or post petitions we are going to use supertest. The [api.test.ts](tests/api.test.ts), has the implementation of the tests. The `beforeAll` method is charge of starting the API.

After configuring the tests in the `package.json` we can run them using `npm run test`.

### Docker image for the restapi
In the Dockerfile of this folder we have the command for building an image for the restapi. We just install the dependencies and launch the API using `npm start`.

### Monitoring (Prometheus and Grafana)
In this step we are going use [Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/) to monitor the restapi. First step is modifying the restapi launch to capture profiling data. In nodejs this is very easy. After installing the required packages (express-prom-bundle and prom-client), we need to modify the `restapi/server.js` in order to capture the profiling data adding:
```javascript
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);
```
Now when we launch the api, in [http://localhost:5000/metrics](http://localhost:5000/metrics) we have a metrics endpoint from which get the profiling data. The idea here is to have another piece of software running (called [Prometheus](https://prometheus.io/)) that will get this data, let say, every five seconds. Then, another software called [Grafana](https://grafana.com/) will display this using beautiful charts.

For running Prometheus and Grafana we can use several docker images. Check `docker-compose.yml` to see how these images are launched. 

<mark>Note: in the `prometheus.yml` we are telling prometheus where is our restapi metrics end point. In Grafana `datasources/datasource.yml` we are telling where to find prometheus data.</mark>

<mark>In both configuration files we need to stablish the uris of restapi metrics and the prometheus datasource. Right now they are configured to work using docker-compose network. If you want to use these individual docker commands, you need to change these uris to point to localhost</mark>

Once launched all the system is launched (see the Quick Start Guide), we can simulate a few petitions to our webservice:

```
sudo apt-get install apache2-utils
ab -m GET -n 10000 -c 100 http://localhost:5000/api/users/list
```
In the Grafana dashboard we can see how the number of petitions increases dramatically after the call.

A good reference with good explanations about monitoring in nodejs can be found [here](https://github.com/coder-society/nodejs-application-monitoring-with-prometheus-and-grafana).
