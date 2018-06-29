const path = require('path')
const express = require('express')
const compression = require('compression')
const helmet = require('helmet')
const session = require('express-session')
const expressWinston = require('express-winston')
// const mongoose = require('./services/mongoose')
const keycloak = require('./services/auth')
const mongoStore = require('./services/sessions')
// const { setup } = require('../services/setup')
const config = require('./config')
const log = require('./services/logger')
const { NODE_ENV } = process.env
const loggerMiddleware = expressWinston.logger({ winstonInstance: log })

module.exports = (async () => {
  try {
    if (NODE_ENV === 'dev') {
      console.log('================================================')
      console.log(`Starting server [${NODE_ENV}] with the following config`)
      console.log('================================================')
      console.log(config)
      console.log('================================================')
    }
    const server = express()
    // Apply middlewares
    server.use(helmet())
    server.use(compression())
    server.use(express.json())
    server.use(express.urlencoded({ extended: false }))
    server.use(loggerMiddleware)
    server.use(session({
      secret: config.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: mongoStore
    }))

    server.use(keycloak.middleware({ logout: '/logout' }))

    // Express App
    // Apply setup service
    // server.all('/', setup)

    // Apply API routes
    if (NODE_ENV === 'setup') server.use('/', require('./setup/api'))
    else server.use('/', require('./api'))

    if (NODE_ENV === 'setup') {
      server.set('views', path.join(__dirname, '/setup'))
      server.set('view engine', 'jsx')
      server.engine('jsx', require('express-react-views').createEngine())
    }
    // Admin page
    // expressApp.get('/admin', (req, res) => {
    //   if (!req.user || req.user.role !== 'admin') {
    //     app.render(req, res, '/404')
    //   } else {
    //     app.render(req, res, '/admin')
    //   }
    // })

    // expressApp.get('/admin/*', (req, res) => {
    //   if (!req.user || req.user.role !== 'admin') {
    //     app.render(req, res, '/404')
    //   } else {
    //     app.render(req, res, '/admin')
    //   }
    // })

    // expressApp.all('*', (req, res) => {
    //   let nextRequestHandler = app.getRequestHandler()
    //   return nextRequestHandler(req, res)
    // })

    return server.listen(config.PORT, (err) => {
      if (err) {
        throw err
      }
      log.info('> Ready on http://localhost:' + config.PORT + ' [' + NODE_ENV + ']')
    })
  } catch (err) {
    log.error('An error occurred, unable to start the server')
    log.error(err)
  }
})()

// ===============================================
// do not delete, we might need it later
// ===============================================

// const express = require('express')
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
