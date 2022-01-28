## The documentation
In this project the documentation is compiled locally and deployed to GitHub pages.
The deployment url is: [https://pglez82.github.io/asw2122_0/](https://pglez82.github.io/asw2122_0/).

### Documentation build
For the documentation we are going to use [AsciiDoc](https://asciidoc.org/) and [PlantUML](https://plantuml.com) and follows the [Arc42](https://github.com/arc42/arc42-template) template. If you want to be able to generate the doc locally you need to install Ruby, Java and some dependencies to translate the asciidoc code into html. If you are in Linux you can install Ruby and Java simply by executing:

```shell
apt-get install ruby openjdk-8-jre
```

On Windows you can use [these instructions](https://www.ruby-lang.org/en/documentation/installation). Probably you will have Java already installed in your system, if not, you can download it [here](https://www.oracle.com/es/java/technologies/javase/javase8-archive-downloads.html)

Once Ruby is working you can install some gems with `asciidoctor` and `asciidoctor-diagram`.

```shell
gem install asciidoctor asciidoctor-diagram
```

Now it is turn to install some dependencies in the `package.json` file inside the `docs` directory:

```shell
cd docs
npm install
```
After installing these tools we can generate the documentation.
```shell
npm run build
```
The documentation will be generated under the `docs/build` directory. 

### Documentation deployment
If we want to deploy it to GitHub pages, so it is accesible via [https://pglez82.github.io/asw2122_0/](https://pglez82.github.io/asw2122_0/) we need to execute `npm run deploy`.

If you check the `package.json` in this directory you can see how deploying is as easy as executing `gh-pages -d build`, which can be directly executed using `npm run deploy` in the docs directory. The `gh-pages` package is in charge of pushing the documentation generated directory (basically some htmls) to a special github branch called gh-pages. Everything pushed to this branch is accessible in the repository page. Note that we only want to push there the documentation. Also is important that the documentation build is not pushed to the other branches of the project.