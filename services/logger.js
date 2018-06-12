const path = require('path')
const winston = require('winston')

const options = {
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
  console: {
    level: process.env.NODE_ENV === 'test' ? 'critic' : 'silly',
    colorize: true,
    timestamp: function () {
      return new Date().toISOString()
    }
  }
}

let transportArray = [
  new winston.transports.Console(options.console)
]

if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test') {
  transportArray.push(
    new winston.transports.File(options.fileInfo),
    new winston.transports.File(options.fileError)
  )
}

const log = new winston.Logger({
  transports: transportArray
})

module.exports = log
