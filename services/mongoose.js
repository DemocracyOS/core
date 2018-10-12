const mongoose = require('mongoose')
const { MONGO_URL } = require('../config')
const log = require('./logger')

mongoose.Promise = global.Promise

mongoose
  .connect(MONGO_URL)
  .then(() => {
    log.debug('connection established to ' + MONGO_URL)
  })
  .catch((err) => {
    log.error(err)
    process.exit(1)
  })

// Initialize models
// Don't forget to add models
require('../models/user')
require('../models/community')
require('../models/customForm')
require('../models/document')
require('../models/comment')
require('../models/like')

const db = mongoose.connection

function shutdown () {
  db.close(function () {
    log.debug('Mongoose default connection disconnected through app termination')
    process.exit(0)
  })
}

process.on('SIGTERM', () => shutdown())
process.on('SIGINT', () => shutdown())
process.once('SIGUSR2', () => shutdown())

// Enable the mongoose debugger
mongoose.set('debug', (coll, method, query, doc, options) => {
  let set = {
    coll: coll,
    method: method,
    query: query,
    doc: doc,
    options: options
  }

  log.debug({
    dbQuery: set
  })
})

module.exports = mongoose

// const mongoose = require('mongoose')
// const log = require('./logger')
// const { MONGO_URL } = require('./config')

// mongoose.Promise = global.Promise

// mongoose
//   .connect(MONGO_URL)
//   .then(() => {
//     log.debug('connection established to ' + MONGO_URL)
//   })
//   .catch((err) => {
//     log.error(err)
//     process.exit(1)
//   })

// // initialize models
// require('./models/user')
// // require('../cms/models/setting')
// // require('../cms/models/post')
// // require('../reactions/models/reaction-rule')
// // require('../reactions/models/reaction-instance')
// // require('../reactions/models/reaction-vote')

// const db = mongoose.connection

// function shutdown () {
//   db.close(function () {
//     log.debug('Mongoose default connection disconnected through app termination')
//     process.exit(0)
//   })
// }

// process.on('SIGTERM', () => shutdown())
// process.on('SIGINT', () => shutdown())
// process.once('SIGUSR2', () => shutdown())

// // Enable the mongoose debugger
// mongoose.set('debug', (coll, method, query, doc, options) => {
//   let set = {
//     coll: coll,
//     method: method,
//     query: query,
//     doc: doc,
//     options: options
//   }

//   log.info({
//     dbQuery: set
//   })
// })

// module.exports = mongoose
