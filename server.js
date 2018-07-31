const path = require('path')
const express = require('express')
const compression = require('compression')
const helmet = require('helmet')
const session = require('express-session')
const expressWinston = require('express-winston')
// const mongoose = require('./services/mongoose')
const { keycloak } = require('./services/auth')
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
    // Apply API routes
    server.use('/', require('./api'))

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
