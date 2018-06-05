# Admin Panel for DemocracyOS V3

> This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

This is the admin repository, using `react-admin`. After changing anything in the code, you should build the new JS.

This module is delivered as a static content.

### Development

We use the creat-react-app development server for hot reload. To start the development server, please dont start the start script under this folder. Go backwards and run the `start-admin` script of the main `package.json` of the backend project.

```
/backend/admin$ cd ..
/admin$ npm run start-admin
```

The app will start under [http://localhost:8080](http://localhost:8080).

### Production

Because the admin is delivered as a static page, you have to build the admin panel to make it available for production

```
/backend/admin$ cd ..
/admin$ npm run build-admin
```
---
Contact me on twitter for support [@guillermocroppi](https://twitter.com/guillermocroppi)

_Guillermo Croppi - Democracia en Red Developer_ 



