## The webapp
In this case we are using React with Typescript for the webapp. Lets create the app in the directory webapp with the following command (make sure you have npm installed in your system):
```console
npx create-react-app my-app --template typescript
```
At this point we can already run the app with:
```console
cd webapp
npm start
```
The app will launch and it will be listening in port 3000. At this point this app is a Hello World app in React.

Lets make some modifications to the app, we will create an app that asks the name and email to the user and send it to an api rest. The webapp will list all the register users in the site.

Basically the app should be able to get the name and email of a user, send it to the api, and then refresh the list of the users from the api. You can check the relevant code in the components [EmailForm.tsx](src/components/EmailForm.tsx) and [UserList.tsx](src/components/UserList.tsx). The [App.tsx](src/App.tsx) component acts as the coordinator for the other components.

### Testing the webapp

#### Unit tests
Basically these tests make sure that each component work isolated. It is important to check that they render properly. These tests are done using jest and you can execute them with `npm run test`. A code coverage analysis is generated every time we run the tests. If properly configured, this can be exploited by tools like [CodeCov](https://about.codecov.io/) to create reports of code coverage.
Some tests needs to mock some parts of the application. For instance, the `EmailForm.tsx` component uses the api for adding a user. In the unitary tests we should mock these calls to make more robusts tests. You can check the file [EmailForm.test.tsx](src/components/EmailForm.test.tsx) to learn how this is done.
For instance:
```javascript
jest.spyOn(api,'addUser').mockImplementation((user:User):Promise<boolean> => Promise.resolve(false))
```
will mock the implementation of the addUser function. Instead of calling the API, we just return false simulating that the webservice has failed to add a new user.

### Docker image for the web app
The `Dockerfile` for the webapp is pretty simple. Just copy the app, install the dependencies, build the production version an then run a basic webserver to launch it. 

In order to run the app, we need a server. `npm start` is not good for production so we are going to use [Express](https://expressjs.com/es/). Check [server.js](webapp/server.ts) in the webapp to understand the configuration. As we will run it in port 3000 (in localhost), we have to bind this port with the port in our local machine.


### Launching everything at the same time (docker-compose)
All the containers will be launched in order using docker compose. Check the file [docker-compose.yaml](docker-compose.yaml) to see the definition of the containers and their launch process. Here are the commands to launch the system and to turn it down:
```
docker-compose up
```
```
docker-compose down
```
<mark>Note: if you change something in the code you should rebuild the images using the `--build` flag</mark>

### Continuous integration/Continuous Delivery
In this step we are going to setup GitHub Actions in order to have CI in our system. The idea is that, every time we create a new release, build the system (restapi and webapp), run the tests, and if everything is ok, build the docker images and upload them to Github packages. Then we can deploy the application using these images.

The workflow for this is in [asw2122.yml](.github/workflow/asw2122.yml). In this file you can see that there are two jobs, one for the restapi, one for the webapp. Jobs are executed in pararel so this will speed up our build.

So, the first to jobs in this file build the webapp and the restapi (in parallel). If everything goes well, check the e2e tests (later in this document) and if these acceptance tests pass ok, create the docker images and deploy them.


### E2E testing
Integration tests is maybe the most difficult part to integrate in our system. We have to test the system as a whole. The idea here is to deploy the system and make the tests using [jest-puppeteer](https://github.com/smooth-code/jest-puppeteer) (browser automatization) and [jest-cucumber](https://www.npmjs.com/package/jest-cucumber) (user stories). We will also be using [expect-puppeteer](https://www.npmjs.com/package/expect-puppeteer) to make easier the test writing. All the structure needed is under the `webapp/e2e` directory. This tests can be run locally using `npm run test:e2e` and they will be run also in GitHub Actions, just after the unitary tests. 

In this project the E2E testing user stories are defined using Cucumber. Cucumber uses a language called Gherkin to define the user stories. You can find the example in the `features` directory. Then, the actual tests are in the folder `steps`. We are going to configure jest to execute only the tests of this directory (check the `jest.config.ts` file). 

The E2E tests have two extra difficulties. The first one, we need a browser to perform the tests as if the user was using the application. For this matter, we use `jest-peppeteer` that will launch a Chromium instance for running the tests. The browser is started in the `beforeAll` function. Note that the browser is launched in a headless mode. This is neccesary for the tests to run in the CI environment. If you want to debug the tests you can always turn this feature off. The second problem is that we need to run the restapi and the webapp at the same time to be able to run the tests. For achieving this, we are going to use the package `start-server-and-test`. This package, allows us to launch multiple servers and then run the tests. No need for any configuration. We can configure it straight in the `package.json` file:

```json
"test:e2e": "start-server-and-test 'npm --prefix ../restapi start' http://localhost:5000/api/users/list prod 3000 'cd e2e && jest'"
```

The package accepts pairs of parameters (launch a server and an URL to check if it is running. It also accepts npm commands (for instance prod, for the webapp, that will run `npm run prod`). The last parameter of the task will be launching jest to run the E2E tests.

### Load testing (Gatling)
This part will be carried out using [Gatling](https://gatling.io/). Gatling will simulate load in our system making petitions to the webapp.

In order to use Gatling for doing the load tests in our application we need to [download](https://gatling.io/open-source/start-testing/) it. Basically, the program has two parts, a [recorder](https://gatling.io/docs/current/http/recorder) to capture the actions that we want to test and a program to run this actions and get the results. Gatling will take care of capture all the response times in our requests and presenting them in quite useful graphics for its posterior analysis.

Once we have downloaded Gatling we need to start the [recorder](https://gatling.io/docs/current/http/recorder). This works as a proxy that intercepts all the actions that we make in our browser. That means that we have to configure our browser to use a proxy. We have to follow this steps:

1. Configure the recorder in **HTTP proxy mode**.
2. Configure the **HTTPs mode** to Certificate Authority.
3. Generate a **CA certificate** and key. For this, press the Generate CA button. You will have to choose a folder to generate the certificates. Two pem files will be generated.
4. Configure Firefox to use this **CA certificate** (Preferences>Certificates, import the generated certificate).
5. Configure Firefox to use a **proxy** (Preferences>Network configuration). The proxy will be localhost:8000.
6. Configure Firefox so it uses this proxy even if the call is to a local address. In order to do this, we need to set the property `network.proxy.allow_hijacking_localhost` to `true` in `about:config`. 

Once we have the recorder configured, and the application running (in Heroku for instance), we can start recording our first test. We must specify a package and class name. This is just for test organization. Package will be a folder and Class name the name of the test. In my case I have used `GetUsersList` without package name. After pressing start the recorder will start capturing our actions in the browser. So here you should perform all the the actions that you want to record. In my case, I opened the main website and added one user. Once we stop recording the simulation will be stored under the `user-files/simulations` directory, written in [Scala](https://www.scala-lang.org/) language. I have copied the generated file under `webapp/loadtestexample` just in case you want to see how a test file in gatling looks like. Note that this simulation included a post petition to the restapi. Post data is stored under a different directory in the gattling installation directory (`user-files/resources`). 

We can modify our load test for instance to inject 20 users at the same time:
```scala
setUp(scn.inject(constantUsersPerSec(3).during(15))).protocols(httpProtocol)
```
changing it in the scala file. Check [here](https://gatling.io/docs/gatling/reference/current/core/injection/) to see more options about generating load.
In order to execute the test we have to execute:

```bash
gatling.sh -s GetUsersList
```

In the console, we will get an overview of the results and in the results directory we will have the full report in web format.

It is important to note that we could also dockerize this load tests using this [image](https://hub.docker.com/r/denvazh/gatling). It is just a matter of telling the docker file where your gatling configuration and scala files are and the image will do the rest.
