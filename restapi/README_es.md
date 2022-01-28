## Restapi

El objetivo de esta parte es crear una al rest APi utilizando Express y Node.js con TypeScript. Solo vamos a implementar dos funciones. Una petición post para registrar un nuevo usuario y una petición get que devolverá un listado de todos los usuarios en el sistema. Es servicio web se desplegará utilizando Docker.

Vamos a analizar los paquetes principales utilizados en esta parte (archivo package.json):
- express: Es la dependencia principal para la construcción de la API. Express es un framework web de NodeJS muy util para la construcción de endpoints de una API aunque permite otras funcionalidades
- cors: Cross-Origin Resource Sharing, Es util para permitir peticiones solo desde determinados dominios, en este ejemplo,unicamente permitimos peticiones desde el localhost.
- express-validator: Util para la validación de las peticiones de la API. Mejora la seguridad evitando ataques de inyección de código.    
- express-prom-bundle y prom-client: Middleware para capturar las peticiones y enviar estadísticas a prometheus. Es muy util para monitorizar nuestro servicio web.
- @types packages. Tipos para programar utilizando Typescript.
     
Este código es bastante sencillo, el archivo [server.ts](server.ts) lanza la API y en el archivo [api.ts](api.ts) donde ESTÁN las 2 peticiones. 

Para lanzar la API podemos ejecutar `npm start`. Este comando lanzará el archivo `server.ts`. El paquete `ts-node-dev` recargará el servidor cada vez que guardemos algún cambio en nuestro código de Typescript. Es muy útil.

### Testeando la rest api
Para testear necesitamos simular peticiones contra la API. Para hacer esto utilizaremos una herramienta llamada [Supertest](https://www.npmjs.com/package/supertest).

<mark>Ojo: Estas dependencias se guardaran para modo desarrollo, no son necesarias en producción.</mark>

La idea es utilizar Jest (como en la webapp) como framework principal de testing. Para realizar las peticiones GET o POST utilizaremos Supertest. El archivo [api.test.ts](tests/api.test.ts), contiene la implementación de los tests. El método `beforeAll` se carga al iniciar la API.

Tras configurar los tests en el `package.json` podemos ejecutarlos utilizando `npm run test`.

### Imagen Docker para la restapi
En el Dockerfile de este directorio se encuentran los comandos para construir una imagen de la restapi. Solo tenemos que instalar las dependencias y arrancar la API utilizando `npm start`.

### Monitorización (Prometheus y Grafana)
En esta etapa vamos a utilizar [Prometheus](https://prometheus.io/) y [Grafana](https://grafana.com/) para monitorizar nuestra restapi. El primer paso es modificar el lanzamiento de la restapi para capturar los datos de "profiling". En Nodejs es muy sencillo, tras instalar los paquetes necesarios (express-prom-bundle y prom-client), debemos modificar el `restapi/server.js` para capturar los datos de profiling añadiendo:
```javascript
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);
```
Ahora cuando lancemos la API en [http://localhost:5000/metrics](http://localhost:5000/metrics) tendremos un endpoint de metricas con datos de desempeño. La idea es tener otra pieza de software corriendo (llamada [Prometheus](https://prometheus.io/)) que cogerá estos datos, digamos, cada cinco segundos. a continuación otro software llamado [Grafana](https://grafana.com/) los mostrará con graficos chulos.

Para lanzar Prometheus y Grafana podemos utilizar diferentes imagenes de Docker. Comprueba `docker-compose.yml` para ver como se lanzan estas imagenes. 

<mark>Ojo: en `prometheus.yml` le estamos indicando a prometheus donde esta el endpoint de metricas de nuesta restapi. En Grafana `datasources/datasource.yml` indicamos donde encontrar los datos de prometheus.</mark>

<mark>En ambos archivos de configuración necesitamos establecer las uris de las metricas de la resapi y de la fuente de datos de prometheus. En este momento están configurados para utilizar la red de docker-compose.  Si quieres utilizar estos comandos de docker individualmente tienes que cambiar las uris para que apunten al localhost</mark>

Una vez lanzado esto todo el sistema está corriendo (ver la guia de inicio rápido). Ahora podemos simular unas cuantas peticiones en nuestro servicio web.

```
sudo apt-get install apache2-utils
ab -m GET -n 10000 -c 100 http://localhost:5000/api/users/list
```

En el cuadro de mando de Grafana podemos ver como aumenta rapidamente el número de peticiones tras llamarla.

Una buena referencia con explicaciones sobre monitorización en Nodejs puede encontrarse [Aqui](https://github.com/coder-society/nodejs-application-monitoring-with-prometheus-and-grafana).
