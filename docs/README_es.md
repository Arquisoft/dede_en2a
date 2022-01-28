## Documentación
La documentación de este proyecto se compila localmente y se despliega en GitHub pages.
la url en la que se despliega es: [https://arquisoft.github.io/dede_0/](https://arquisoft.github.io/dede_0/).

### Build Documentación
For the documentation we are going to use [AsciiDoc](https://asciidoc.org/) and [PlantUML](https://plantuml.com) and follows the [Arc42](https://github.com/arc42/arc42-template) template. If you want to be able to generate the doc locally you need to install Ruby and some dependencies to translate the asciidoc code into html:

Para la documentación vamos a utilizar [AsciiDoc](https://asciidoc.org/) y [PlantUML](https://plantuml.com). Seguiremos la plantilla [Arc42](https://github.com/arc42/arc42-template). Si quieres general la documentación en tu ordenador, necesitas instalar Ruby, Java y algunas dependencias para traducir el asciidoc en código html. Si estás en una máquina Linux puedes instalar Java y Ruby simplemente ejecutando:

```shell
apt-get install ruby openjdk-8-jre
```

En Windows puedes seguir [estas instrucciones](https://www.ruby-lang.org/en/documentation/installation) para instalar Ruby. Probablemente tengas un JRE de Java instalado, sino puedes descargarlo [aquí](https://www.oracle.com/es/java/technologies/javase/javase8-archive-downloads.html): 

Una vez que Ruby está instalado y funcionando podemos instalar `asciidoctor` y `asciidoctor-diagram`.

```shell
gem install asciidoctor asciidoctor-diagram
```

Ahora solo nos queda instalar las dependencias del `package.json` dentro del directorio `docs`:

```shell
cd docs
npm install
```
Después de instalar todas estas herramientas ya deberíamos de ser capaces de generar la documentación:
```shell
npm run build
```
La documentación se generará en el directorio `docs/build`. 

### Despliegue Documentación
Si queremos desplegar la documentación en GitHub pages, estará accesible en [https://arquisoft.github.io/dede_0/](https://arquisoft.github.io/dede_0/) necesitamos ejecutar `npm run deploy`.

Si revisas el `package.json` de este directorio veras como desplegar es tan facil como ejecutar `gh-pages -d build`, que puede hacerse ejecutando directamente `npm run deploy` en el directorio de la doumentación. el paquete `gh-pages` se encarga de subir la documentación generada (basicamente archivo html) a una rama especial de github llamda gh-pages. Todo lo que se suba a esa rama es acesible en la página del repositorio. Ten en cuenta que solo queremos subir ahí la documentación. También es importante que el build de la documentación no se suba a otras ramas del proyecto.