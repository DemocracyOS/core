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

First you should install Keycloak before configuring the app. [Read more here](/docs/config-keycloak.md) on how to setup keycloak for development and testing env.

After that, continue configuring the app by following this steps: [Configuring the App](/docs/config-app.md)

## More info

- Read more about [authentication, authorization and user management](/docs/about-auth.md)
- On how to read and build the API documentation, go here: [The API Docs](/docs/build-api.md)

## Useful scripts

#### Start in development env
```
npm run dev
```

#### Launch tests
```
npm run test
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