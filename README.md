# Backend v3

Backend for DemocracyOS v3

### Features
- ExpressJS
- Pagination (Powered by [express-paginate](https://github.com/expressjs/express-paginate))
- [helmet](https://github.com/helmetjs/helmet) ready (Middleware - Adds security headers)
- [compression](https://github.com/expressjs/compression) ready (Middleware)
- MongoDB & Mongoose
- Keycloak for user & role management
- Admin panel, powered by react-admin

## Get Started

#### Clone the repo
```
$ git clone https://github.com/DemocracyOS/core.git
```

#### Get the service up and running

All the required services for the aplication to work are defined inside the `docker-compose.yml` file.

> **Have in mind**: Inside the docker-compose.yml there are enviroment variables that will be used to build your containers, like users, passwords, ports, etc. If you want to override them, create a docker-compose.override.yml file and change all the settings you want. The following commands will use the docker-compose.override.yml settings instead of the docker-compose.yml file

First, make sure you have [Docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/install/) available.

Then run `$ docker-compose pull`. This _pulls an image associated with a service defined in a docker-compose.yml or docker-stack.yml file, but does not start containers based on those images._ (Acording to docker docs)

You can check your docker images running `$ docker images`

```
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
mysql               5.7                 66bc0f66b7af        6 days ago          372MB
mongo               3.6                 bbed8d0e01c1        6 days ago          368MB
jboss/keycloak      latest              b244ccfe3a8a        12 days ago         727MB
```

Now you can run the service containers by running `docker-compose up`.

If you prefer, you can run the service containers in **detached mode**_: Run containers in the background, print new container names_. Do it by executing `$ docker-compose up`

To stop your service containers, run `$ docker-compose stop`

You can see all your available containers by running `$ docker ps -a`

```
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                      PORTS               NAMES
1daba16591fb        jboss/keycloak      "/opt/jboss/docker..."   10 minutes ago      Up 8 seconds        0.0.0.0:8080->8080/tcp     core_keycloak_1
475f9ee135f1        mysql:5.7           "docker-entrypoint..."   10 minutes ago      Up 9 seconds        3306/tcp                   core_mysql_1
abfe83f42a20        mongo:3.6           "docker-entrypoint..."   10 minutes ago      Up 8 seconds        0.0.0.0:27017->27017/tcp   core_mongo_1
```

#### Download the app dependencies
```
$ npm install
```

#### Set up Keycloak 

First make sure you have the containers running `$ docker-compose up -d`

Now we will connect to the Keycloak Admin CLI. To execute a command to our keycloak container, place `$ docker exec <container_name> <command...>`
First we need to authenticate. The `kcadm config credentials` starts an authenticated session. This approach maintains an authenticated session between the kcadm command invocations by saving the obtained access token and the associated refresh token. It may also maintain other secrets in a private configuration file. By the way, don't worry, you dont have to change the `localhost:8080`, remember that you're inside the container, you dont need to change the port if you have a custom port for the host.

How you run it with `docker exec`:

```
docker exec core_keycloak_1 keycloak/bin/kcadm.sh config credentials --server http://localhost:8080/auth --realm master --user {THE_ADMIN_USERNAME} --password {THE_ADMIN_PASSWORD}
```

For example, according to the default values on `docker-compose.yml`, it would be:
```
docker exec core_keycloak_1 keycloak/bin/kcadm.sh config credentials --server http://localhost:8080/auth --realm master --user admin --password Pa55w0rd
```
You should get just one logged message: `Logging into http://localhost:8080/auth as user admin of realm master`. Now you are authenticated and you can use `kcadm` as the admin.

Now we have to create the realms for test enviroment and dev enviroment

```
docker exec core_keycloak_1 keycloak/bin/kcadm.sh create realms -s realm=democracyos-dev -s enabled=true
docker exec core_keycloak_1 keycloak/bin/kcadm.sh create realms -s realm=democracyos-test -s enabled=true
docker exec core_keycloak_1 keycloak/bin/kcadm.sh create partialImport -r democracyos-dev -s ifResourceExists=OVERWRITE -o -f /var/realm-dev.json
docker exec core_keycloak_1 keycloak/bin/kcadm.sh create partialImport -r democracyos-test -s ifResourceExists=OVERWRITE -o -f /var/realm-test.json
docker exec core_keycloak_1 keycloak/bin/kcadm.sh create users -r democracyos-dev -s username=user -s enabled=true
docker exec core_keycloak_1 keycloak/bin/kcadm.sh set-password -r democracyos-dev --username user --new-password 123456
docker exec core_keycloak_1 keycloak/bin/kcadm.sh create users -r democracyos-dev -s username=admin -s enabled=true
docker exec core_keycloak_1 keycloak/bin/kcadm.sh set-password -r democracyos-dev --username admin --new-password 123456
docker exec core_keycloak_1 keycloak/bin/kcadm.sh add-roles --uusername admin --rolename admin -r democracyos-dev
docker exec core_keycloak_1 keycloak/bin/kcadm.sh create users -r democracyos-test -s username=user -s enabled=true
docker exec core_keycloak_1 keycloak/bin/kcadm.sh set-password -r democracyos-test --username user --new-password 123456
docker exec core_keycloak_1 keycloak/bin/kcadm.sh create users -r democracyos-test -s username=admin -s enabled=true
docker exec core_keycloak_1 keycloak/bin/kcadm.sh set-password -r democracyos-test --username admin --new-password 123456
docker exec core_keycloak_1 keycloak/bin/kcadm.sh add-roles --uusername admin --rolename admin -r democracyos-test
```

Now enter to http://localhost:4000/ and go to democracyos-test and add "user" to the group "Accountable" so the tests works

#### To setup the app
Before doing anything, make sure you have your `.env` file. Copy the `.env.dist` in a `.env` file and define the values. 

```
COMMUNITY_NAME=A community
COMMUNITY_COLOR_HEX=3177cc
DOCUMENT_TYPE_NAME=A simple type
```

Run the following services
```
docker-compose up mongo
```

Then run the seed script. It will create the initial documents inside mongo. But remember to define the NODE_ENV of the installation, so it seeds the correct database. For example, for dev environment, add `NODE_ENV=dev` before running the npm script.
```
NODE_ENV=dev npm run init
```

If everything is ok, the app will be ready to go!

## More info

- Read more about [authentication, authorization and user management](/docs/about-auth.md)
- On how to read and build the API documentation, go here: [The API Docs](/docs/build-api.md)

## Useful scripts


#### Start development env
```
docker-compose up
```

#### Testing: How to lunch the test script

To run the test, first we need the services up and running. We will do that in detach mode, but if you want to see the logs, remove the `-d` option
```
docker-compose up -d mysql mongo keycloak traefik
```
Now you only have to run the app service by executing the comand `npm run test`. This will create a new container, and it will use the services that are available. Note that keycloak takes some time to be up and running. Finally we will add the `--rm` option so our is removed after run. 

```
docker-compose run --rm app npm run test
```

After you are done, remember to stop your services, you can do it by executing `stop`, it will only stop the containers that we started before the run. Note that app is not stoped, cause we removed it after we finished executing the tests.s

```
docker-compose stop
```

#### Launch admin panel in development env
Starts a react server for the react-admin client, with hot-reload included
```
npm run admin:dev
```

#### Builds the admin client
This will be the build that will be served by the server on `/admin`
```
npm run admin:build
```

#### Build the API Docs
This will be the build that will be served by the server on `/docs`
```
npm run docs:build
```