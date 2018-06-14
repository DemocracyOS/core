const express = require('express')
const paginate = require('express-paginate')
const path = require('path')
// const status = require('http-status')
// Utils
const log = require('../services/logger')
const errors = require('../services/errors')

/**
 * Create Routers
 */
const router = express.Router() // api/v1 route wrapper
const routerV1 = express.Router() // router for every resource
const routerV1Services = express.Router() // router for services

/**
 * Middleware for pagination
 */
router.use(
  function (req, res, next) {
    // set default or minimum is 10
    if (req.query.limit <= 10) req.query.limit = 10
    next()
  },
  paginate.middleware(10, 50),
  function (req, res, next) {
    // console.log(req)
    next()
  }
)

// ===============================
// Resource routes
// ===============================

// routerV1.use('/users', require('../old/api/users'))

// ===============================
// Resource services
// ===============================

routerV1Services.use('/reactions', require('../old/api/reaction-services'))

routerV1.use('/services', routerV1Services)

// Add everything to route wrapper
router.use('/api/v1', routerV1)

// ===============================
// Documentation services
// ===============================

router.use('/api/docs', express.static(path.join(__dirname, '../docs')))

// Catch 404 and forward to error handler.
// router.use((req, res, next) => {
//   next(errors.ErrNotFound)
// })

// General api error handler. Respond with the message and error if we have it
// while returning a status code that makes sense.
// router.use((err, req, res, next) => {
//   log.error(err)
//   if (err instanceof errors.APIError) {
//     res.status(err.status).json({
//       message: res.locals.t(`error/${err.translationKey}`),
//       error: err
//     })
//   } else {
//     res.status(500).json({})
//   }
// })

module.exports = router
