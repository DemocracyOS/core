const restify = require('restify')
const mongoose = require('./mongoose')
const routes = require('./api')
const { PORT, SESSION_SECRET, ROOT_URL } = require('./config')
const { NODE_ENV } = process.env
const log = require('./logger')

const server = restify.createServer({
  name: 'DemocracyOS-api',
  version: '1.0.0',
  log: log
})

server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

// server.pre(function (req, res, next) {
//   server.log.info({ req: req }, 'no req.log in "pre" handler');
//   next();
// });
// server.get('/', function (req, res, next) {
//   req.log.info('have "req_id" and "route" fields in route handler');
//   res.send('hi');
//   next();
// });

routes.applyRoutes(server)
server.listen(PORT, function () {
  // handle errors
  const db = mongoose.connection

  db.on('error', (err) => {
    log.error('Mongoose default connection error: ' + err)
  })

  db.on('disconnected', () => {
    log.debug('Mongoose default connection disconnected')
  })

  // db.on('error', (err) => {
  //   if (err.message.code === 'ETIMEDOUT') {
  //     console.log('Mongoose default connection error: '  + err)
  //   }
  // })

  db.once('open', () => {
    log.info('%s listening at %s', server.name, server.url)
  })
})

// const express = require('express')
// const next = require('next')
// const nextAuth = require('next-auth')
// const compression = require('compression')
// const helmet = require('helmet')
// const passport = require('passport')
// const session = require('express-session')
// const MongoStore = require('connect-mongo')(session)
// const authFunctions = require('../users/auth/functions')
// const authProviders = require('../users/auth/providers')
// const { setup } = require('../services/setup')
// const { middleware: loggerMiddleware, log } = require('./logger')
// const mongoose = require('./mongoose')

// const app = next({
//   dev: NODE_ENV !== 'production',
//   quiet: NODE_ENV === 'test'
// })

// module.exports = (async () => {
//   try {
//     await app.prepare()

//     const server = express()

//     // Apply middlewares
//     server.use(helmet())
//     server.use(compression())
//     server.use(express.json())
//     server.use(express.urlencoded({ extended: true }))
//     server.use(passport.initialize())
//     server.use(passport.session())
//     // server.use(loggerMiddleware)

//     // Init authentication and next server
//     const nextAuthOptions = await nextAuth(app, {
//       sessionSecret: SESSION_SECRET,
//       providers: authProviders(),
//       expressApp: server,
//       functions: authFunctions,
//       serverUrl: ROOT_URL,
//       expressSession: session,
//       sessionStore: new MongoStore({
//         mongooseConnection: mongoose.connection,
//         collection: 'sessions',
//         stringify: false
//       })
//     })
//     // Express App
//     const expressApp = nextAuthOptions.expressApp
//     // Apply setup service
//     expressApp.all('/', setup)

//     // Apply API routes
//     expressApp.use('/api/v1.0', require('./api'))

//     // Admin page
//     expressApp.get('/admin', (req, res) => {
//       if (!req.user || req.user.role !== 'admin') {
//         app.render(req, res, '/404')
//       } else {
//         app.render(req, res, '/admin')
//       }
//     })

//     expressApp.get('/admin/*', (req, res) => {
//       if (!req.user || req.user.role !== 'admin') {
//         app.render(req, res, '/404')
//       } else {
//         app.render(req, res, '/admin')
//       }
//     })

//     expressApp.all('*', (req, res) => {
//       let nextRequestHandler = app.getRequestHandler()
//       return nextRequestHandler(req, res)
//     })

//     return expressApp.listen(PORT, (err) => {
//       if (err) {
//         throw err
//       }
//       console.log('> Ready on http://localhost:' + PORT + ' [' + NODE_ENV + ']')
//     })
//   } catch (err) {
//     log.error('An error occurred, unable to start the server')
//     log.error(err)
//   }
// })()
