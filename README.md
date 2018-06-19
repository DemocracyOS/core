# Backend v3

Backend for DemocracyOS v3, powered by Restify (RESTful web service framework)

### Features
- ExpressJS
- Pagination (Powered by [express-paginate](https://github.com/expressjs/express-paginate))
- [helmet](https://github.com/helmetjs/helmet) ready (Middleware - Adds security headers)
- [compression](https://github.com/expressjs/compression) ready (Middleware)
- MongoDB & Mongoose ready
- Keycloak for user & role management
- Admin panel, powered by react-admin
- And more

### Get Started
First, create copy .env file and make sure to provide a value for `DEMOCRACYOS_MONGO_URL` (Something like `mongodb://localhost/my-democracy-db`).

Then install the dependencies

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
$ npm run build-admin
```

But if you are going to make some code into the admin panel, then use the development script that enables the developḿent server for the react-admin, with hot reloading and proxy enable to avoid CORS. (Because the react development server uses port 8080).

```
$ npm run start-admin
```

And then go to `/admin`, you will find the admin project there. Remember that you will have to build the admin panel if you want the backend to deliver it.

---
Contact me on twitter for support [@guillermocroppi](https://twitter.com/guillermocroppi)

_Guillermo Croppi - Democracia en Red Developer_ 
