## La webapp
Utilizaremos React con Typescript para la webapp. Vamos a crear la app en el directorio webapp con los siguientes comandos (asegurate que npm está instalado en tu sistema:)
```console
npx create-react-app my-app --template typescript
```
En este punto ya podemos correr la app con:
```console
cd webapp
npm start
```
La app se lanzará y escuchará en el puerto 3000. Ahora mismo la app es un "Hola Mundo" en React.
Vamos a hacer algunas modificaciones en la app, crearemos una app que pida el nombre y el email al usuario y lo envíe a una api rest.Además la webapp listará todos los usuarios registrados.

Basicamente la app debería ser capaz de coger el nombre y el email del usuario, enviarlo a la api y refrescar la lista de los usuarios desde la api. Puedes revisar el código relevante en los componentes
[EmailForm.tsx](src/components/EmailForm.tsx) y [UserList.tsx](src/components/UserList.tsx). El componente [App.tsx](src/App.tsx) funciona como coordinador de los otros componentes.

### Testeando la webapp

#### Tests unitarios
Basicamente estos tests se aseguran que cada componente trabaja de manera aislada. Esto es importante para comprobar que se renderizan correctamente. Estos tests se realizan utilizando jest y pueden ejercutarse con `npm run test`. Cada vez que se ejecutan los tests se realiza un analisis de covertura de código. Si se configura apropiadamente este analisis puede ser explotado por herramientas como [CodeCov](https://about.codecov.io/) para crear informes de covertura de código.

Algunos tests necesitan simular algunas partes de la aplicación. Por ejemplo el componente `EmailForm.tsx` utiliza la api para añadir un usuario. En los tests unitarios debemos simular estas llamadas para obtener resultados más robustos. Puedes revisar el archivo [EmailForm.test.tsx](src/components/EmailForm.test.tsx) para aprender como se hace esto.
Por ejemplo:
```javascript
jest.spyOn(api,'addUser').mockImplementation((user:User):Promise<boolean> => Promise.resolve(false))
```
Simularemos la función addUser. En lugar de llamar a la API, simulamos que el servicio web ha fallado al tratar de añadir un usuario.

### Imagen Docker para la aplicación web
El `Dockerfile` para la aplicación web es bastante simple. Solo copia la aplicación, instala las dependencias, crea la versión de producción y corre un servidor web básico para lanzarla.

Necesitamos un servidor para poder correr la aplicación. No es recomendable ejecutar `npm start` en un entorno de producción por lo que utilizaremos [Express](https://expressjs.com/es/). Revisa [server.js](webapp/server.ts) en el directotio webapp para entender la configuración. Mientras corramos el servicio en el puerto 3000 (en localhost) tendremos que conectar este puerto con el puerto de nuestra máquina local.

### Lanzar todo al mismo tiempo (docker-compose)
doker compose permite lanzar todos los contenedores en el orden adecuado. Revisa el archivo [docker-compose.yaml](docker-compose.yaml) para ver la definición de los contenedores y sus procesos de lanzamiento. Aqui tienes los comandos para lanzar el sistema y apagarlo:
```
docker-compose up
```
```
docker-compose down
```
<mark>Nota: Si cambias algo en el código deberás reconstruir las imagenes utilizando la bandera `--build`.</mark>

### Integración continua (CI)/Entrega continua (CD)

En esta etapa vamos a configurar GitHub Actions para tener CI en nuestro sistema. La idea es que cada vez que creemos una nuevo entregable (release) se construya el sistema (restapi y webapi), se ejecuten los tests y si todo funciona correctamente se construirán las imagenes de docker y se subirán a GiHub packages. Entonces podremos desplegar nuestra nuestra aplicación utilizando estas imagenes.

El flujo de trabajo se encuentra en el archivo [asw2122.yml](.github/workflows/asw2122.yml).  Si lo revisas podrás ver que existen dos trabajos, uno para la restapi(**unit-test-restapi**) y otro para la webapp(**unit-test-webapp**). Estos trabajos se ejecutan de forma paralela por lo que aceleran la construcción de las imagenes. 

Si todo va bien revisarán los tests e2e (end to end) y si estos test de aceptación pasan se crearán las imagenes de docker y se desplegarán.

### Testting E2E
Los tests de integración es la parte más dificil de integrar en nuestro sistema. tenemos que testear nuestro sistema como un todo. la idea es desplegar nuestro sistema y hacer tests utilizando [jest-puppeteer](https://github.com/smooth-code/jest-puppeteer) (automatización del navegador) and [jest-cucumber](https://www.npmjs.com/package/jest-cucumber) (historias de usuario). También utilizaremos [expect-puppeteer](https://www.npmjs.com/package/expect-puppeteer) para facilitar la escritura de los tests. Todo lo necesario para vertebrar esta estructura se encuentra en el directorio `webapp/e2e`. Estos tests pueden ejecutarse de manera local utilizando el comando `npm run test:e2e` y en GitHub Actions justo después de los tests unitarios.

En este proyecto las historias de usuario utilizadas por los tests E2E se definen utilizando Cucumber. Cucumber utiliza un lenguaje llamado Gherkin para poder crear estas historias. Puedes encontrar un ejemplo en el directorio `webapp/e2e/features` y los tests reales se encuentran en este directorio `webapp/e2e/steps` (revisa el archivo `jest.config.ts`). 

Los tests E2E tienes dos dificultades añadidas. 
- La primera es que necesitamos un navegador que ejecute los tests simulando el comportamiento del usuario utilizando la aplicación. Esa es la razón por la que utilizamos `jest-peppeteer` que lanzará una instancia [Chromium](https://es.wikipedia.org/wiki/Chromium_(navegador)) para correr los tests. El navegador comienza en la función `beforeAll`. Ten en cuenta que el navegador se lanza en "headless mode" (modo sin cabeza: Sin interfaz gráfica)
Esto es necesatio para correr los tests el entorno de integración continua (CI). Si quieres depurar siempre puedes deshabilitar esta característica.
- El segundo problema es que para poder correr estos tests es imprescindible que se estén ejecutando la restapi y la webapp. El paquete `start-server-and-test` nos va a ayudar a lograrlo ya que nos permite lanzar varios servidores a la vez y puede configurarse directamente en el archivo `package.json`:

```json
"test:e2e": "start-server-and-test 'npm --prefix ../restapi start' http://localhost:5000/api/users/list prod 3000 'cd e2e && jest'"
```
El `package.json` acepta pares de parámetos (lanza un servidor y una URl para comprobar que está ejecutandose). Además acepta comandos npm ( para una instancia de la webapp en producción, con `npm run prod`) y el último parámetro lanzará jest para que ejecute los tests E2E.

### Tests de carga (Gatling)
Esta parte se llevará a cabo utilizando [Gatling](https://gatling.io/). Gatling simulará la carga de datos en nuestro sistema haciendo peticiones a la webapp.

Para utilizara Gatling para hacer los tests de carga en nuestra aplicación necesitamos [descargarlo](https://gatling.io/open-source/start-testing/). Basicamenre el programa tiene dos partes. Una [grabadora](https://gatling.io/docs/current/http/recorder) que capturará las acciones que queramos testear y un progrma que ejecute estas acciones y que recoja los resultados. Gatling se encargará de capturar todos los tiempos de respuesta de nuestras peticiones de nuestras peticiones y las presentará graficamente en unos gráficos para un análisis posterior.

Una vez descargado Gatling necesitamos inicializar la [grabadora](https://gatling.io/docs/current/http/recorder). No es más que un proxy que intercepta todas las acciones que se llevan a cabo en nuestro navegador. Eso significa que tenemos que configurar nuestro navegador para que utilize ese proxy siguiendo los siguientes pasos:

1. Configurar la grabadora en **HTTP proxy mode**.
2. Configurar el **modo HTTPs** para "Certificate Authority".
3. Generar un **certificado CA** y una key. Para esto hay que hacer click en el botón "Generate CA" . Tendrás que escoger el directorio para generar los certificados. Se crearán 2 achivos pem.
4. Configurar Firefox para utilizar estos **certificados CA** (Preferences>Certificates, import the generated certificate).
5. Configurar FireFox para utilizar un **proxy** (Preferences>Network configuration). El proxy estará en localhost:8000.
6. Configurar Firefox para que utilice el proxy incluso si la llamada se produce desde una dirección local. Para esto necesitamos configurar la propiedad `network.proxy.allow_hijacking_localhost` a `true` en `about:config`. 

Una vez tengamos la grabadora configurada y la apliación corriendo (en Heroku por ejemplo), podemos comenzar nuestro primer test. Necesitamos especificar un paquete y un nombre de clase para organizar los tests. El paquete será un directorio y el nombre de clase el nombre del test. En mi caso he utilizado `GetUserList`sin nombre de paquete. Despues de presionar "inicio" la grabadora comenzará a capturar las acciones que hagamos en el navegador. En este momento debes llevar a cabo todas las acciones que quieras grabar. En este caso he navegado hasta la página principal de la webapp y he añadido un usuario. Una vez dejemos de grabar, la simulación se almacenará en el directorio `user-files/simulations`. Escrito en lenguaje [Scala](https://www.scala-lang.org/). Si quieres ver el resultado de un test hecho con gatling puedes verlo en `webapp/loadtestexample`. Ten en cuenta que en esta simulación hay una petición post a la restapi. Los datos que se envián en una petitición post, son almacenados por gattling en el directorio `user-files/resources`. 


Podemos modificar nuestro test de carga ,por ejemplo, inyectando 20 usuarios al mismo tiempo:
```
setUp(scn.inject(constantUsersPerSec(3).during(15))).protocols(httpProtocol)
```
cambiarlo en el achivo scala. Revisa [esta página](https://gatling.io/docs/gatling/reference/current/core/injection/) para tener más información sobre como inyectar carga en nuestros tests de carga.

Para correr los tests necesitmos ejecutar:
```
gatling.sh -s GetUserList
```
Se mostrará una vista general de los resultados en la consola, además podremos ver un informe completo en formato wen en el directorio de los resultados.

Es importante saber que podedmos dockerizar estos tests de carga utilizando esta [imagen](https://hub.docker.com/r/denvazh/gatling). Tan solo es cuestión de decirle al archivo docker donde se encuentra tu configuración de gatlin y los archivos scala. La imagen hará el resto.
