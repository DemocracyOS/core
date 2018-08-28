const path = require('path')
const express = require('express')
const paginate = require('express-paginate')
const auth = require('../services/auth')
const middlewares = require('../services/middlewares')
// const status = require('http-status')
// Utils
const log = require('../services/logger')
const errors = require('../services/errors')

// Create Routers
const router = express.Router() // api/v1 route wrapper
const routerV1 = express.Router() // router for every resource
const routerV1Services = express.Router() // router for services
const { NODE_ENV } = process.env

// Middleware for pagination
router.use(
  middlewares.addPaginationParams,
  paginate.middleware(10, 50),
  middlewares.bindUserToSession
)

// ===============================
// Resource routes
// ===============================

routerV1.use('/community', require('../api/community'))
routerV1.use('/custom-forms', require('../api/customForm'))
routerV1.use('/documents', require('../api/document'))
routerV1.use('/users', require('../api/user'))

// ===============================
// Resource services
// ===============================

// routerV1Services.use('/reactions', require('../old/api/reaction-services'))

routerV1.use('/services', routerV1Services)

// Add everything to route wrapper
router.use('/api/v1', routerV1)

// ===============================
// Documentation
// ===============================

router.use('/docs/api',
  (req, res, next) => {
    if (NODE_ENV !== 'dev') next(errors.ErrForbidden)
    else next()
  },
  express.static(path.join(__dirname, '../docs/api'))
)

// ===============================
// Admin panel
// ===============================

router.use('/admin',
  // Protect with realm role
  auth.keycloak.protect('realm:admin'),
  express.static(path.join(__dirname, '../admin/build'))
)

// Catch 404 and forward to error handler.
router.use((req, res, next) => {
  next(errors.ErrNotFound('Content not found'))
})

// General api error handler. Respond with the message and error if we have it
// while returning a status code that makes sense.
router.use((err, req, res, next) => {
  log.error(err)
  if (err instanceof errors.APIError) {
    res.status(err.status).json({
      message: err.message,
      error: err
    })
  } else {
    res.status(500).json({})
  }
})

module.exports = router
