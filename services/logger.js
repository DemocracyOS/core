const path = require('path')
const winston = require('winston')
const MongoDB = require('winston-mongodb').MongoDB
const { MONGO_URL } = require('../config')

const options = {
  // Config to persist events on "info" level
  fileInfo: {
    name: 'LogApp',
    level: 'info',
    filename: path.join(__dirname, '..', 'logs', 'app.log'),
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  // Config to persist events on "error" level
  fileError: {
    name: 'LogErrors',
    level: 'error',
    filename: path.join(__dirname, '..', 'logs', 'error.log'),
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  mongoDB: {
    db: MONGO_URL,
    name: 'LogMongo',
    collection: 'logs',
    level: 'error'
  },
  console: {
    level: process.env.NODE_ENV === 'test' ? 'critic' : 'silly',
    colorize: true,
    timestamp: function () {
      return new Date().toISOString()
    }
  }
}

let transportArray = [
  new winston.transports.Console(options.console),
  new (winston.transports.MongoDB)(options.mongoDB)
]

// If you wish to persists logs into files, you can use this transports for prod env
// if (process.env.NODE_ENV !== 'prod') {
//   transportArray.push(
//     new winston.transports.File(options.fileInfo),
//     new winston.transports.File(options.fileError),
//   )
// }

let log = new winston.Logger({
  transports: transportArray
})

module.exports = log
