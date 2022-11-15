# Challenge

Make a tiny golang application running in a docker image with less than 2mb, publish the code on github and the image on dockerhub.

# How to build it
Open your console and run:

```console
user@desktop:~$ git clone https://github.com/tiagoknipers/fullcycle.git
user@desktop:~$ cd docker/desafio-go/
user@desktop:~$ docker build -t docker-desafio-go-fullcycle:latest .
```

Important: for clone you need git installed previously.

# How to run it

Open your console and run:

```console
user@desktop:~$ cd docker/desafio-go/
user@desktop:~$ docker run -it -d --name=docker-desafio-go-fullcycle docker-desafio-go-fullcycle:latest
```
# How check if works

The application will print the text "Fullcycle rockz".

```console
user@desktop:~$ docker logs docker-desafio-go-fullcycle
Fullcycle rockz
```

# You can get my imagem from github

```console
user@desktop:~$ docker push knipers/docker-desafio-go-fullcycle:latest
```
