# Challenge

Make a docker-compose project with an app node connected with an mysql database and using nginx like a reverse proxy running on a port 8080.
when user access the app on the browser, the app need insert an people into database and show all record saved on the same table.

# How to build it
Open your console and run:

```console
user@desktop:~$ git clone https://github.com/tiagoknipers/fullcycle.git
user@desktop:~$ cd docker/desafio-nginx-node/
user@desktop:~$ docker-compose up -d --build
```

Important: 
- for clone you need git installed previously.
- for run docker-compose you need install it first.
