# Configuring the App

_*TO DO_

After you have keycloak up an running on port `8080` of localhost, you can start configuring the application.

First, create .env file and copy the variables that are available on `.env.dist`. There you will have a template of default settings for the application. and make sure to provide a value for `DEMOCRACYOS_MONGO_URL` (Something like `mongodb://localhost/my-democracy-db`).

**NOTE**: Watch out when changing variables, like `DEMOCRACY_AUTH_` variables. **The values must be equal to the ones that were configured for keycloak**. The same with other variables.

The template looks like this:

```
DEMOCRACYOS_HOST=localhost
DEMOCRACYOS_PORT=3000
DEMOCRACYOS_MONGO_URL=mongodb://localhost/democracyos
DEMOCRACYOS_MONGO_URL_DEV=mongodb://localhost/democracyos-dev
DEMOCRACYOS_MONGO_URL_TEST=mongodb://localhost/democracyos-test
DEMOCRACYOS_SESSION_SECRET=PLea5EPr0V1d3An0TH3Rs3CR47HeR3
DEMOCRACYOS_ADMIN_EMAIL=changeMe@changeMe.io
DEMOCRACYOS_SMTP_HOST=smtp.changeMe.io
DEMOCRACYOS_SMTP_USERNAME= changeMe
DEMOCRACYOS_SMTP_PORT=465
DEMOCRACYOS_SMTP_PASSWORD=changeMeAnddoNotMakeThisPublic
DEMOCRACYOS_SMTP_FROM_ADDRESS=no-reply@changeMe.io
DEMOCRACYOS_AUTH_REALM=democracyos
DEMOCRACYOS_AUTH_REALM_DEV=democracyos-dev
DEMOCRACYOS_AUTH_REALM_TEST=democracyos-test
DEMOCRACYOS_AUTH_SERVER_URL=:http//localhost:8080/auth
DEMOCRACYOS_AUTH_CLIENT=app
```

| Enviroment Var | Description | Default Value |
| --- | --- | --- |
| `DEMOCRACYOS_HOST` | The host of the app. Remember to set this for production | `localhost` |
| `DEMOCRACYOS_PORT` | The port of the app. Remember to set this for production | `3000` |
| `DEMOCRACYOS_MONGO_URL` | The URL for the database during production enviroment | `mongodb://localhost/democracyos` |
| `DEMOCRACYOS_MONGO_URL_DEV` | The URL for the database during development enviroment | `mongodb://localhost/democracyos-dev` |
| `DEMOCRACYOS_MONGO_URL_TEST` | The URL for the database in testing enviroment | `mongodb://localhost/democracyos-test` |
| `DEMOCRACYOS_SESSION_SECRET` | **Important**. Set your JWT_SECRET environment variable to something random. e.g.: Any of [this](https://www.random.org/strings/?num=10&len=20&digits=on&upperalpha=on&loweralpha=on&unique=off&format=plain&rnd=new) | `none` |
| `DEMOCRACYOS_ADMIN_EMAIL` | Admin email | `none` |
| `DEMOCRACYOS_SMTP_HOST` `DEMOCRACYOS_SMTP_USERNAME` `DEMOCRACYOS_SMTP_PORT` `DEMOCRACYOS_SMTP_PASSWORD` `DEMOCRACYOS_SMTP_FROM_ADDRESS` | **Required** Configuration parameters for the mailer service | `none` |
| `DEMOCRACYOS_AUTH_REALM` `DEMOCRACYOS_AUTH_REALM_DEV` `DEMOCRACYOS_AUTH_REALM_TEST` `DEMOCRACYOS_AUTH_SERVER_URL` `DEMOCRACYOS_AUTH_CLIENT` | **Important** Remember to define this values. No default values are set | `none` |
Then install the dependencies
}

## Install dependencies

```
$ npm install
``` 

Now you are ready to start the API backend under [http://localhost:3000](http://localhost:3000)

### Development

To start the API backend, run the following script

```
$ npm run start
```

If you want to have the admin panel available, open another terminal and run the following script. This will *build* the panel.

```
$ npm run admin:build
```

But if you are going to make some code into the admin panel, then use the development script that enables the developḿent server for the react-admin, with hot reloading and proxy enable to avoid CORS. (Because the react development server uses port 8080).

```
$ npm run admin:dev
```

And then go to `/admin`, you will find the admin project there. Remember that you will have to build the admin panel if you want the backend to deliver it.

