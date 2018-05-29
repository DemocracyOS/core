// process.env.NODE_ENV

const Logger = require('bunyan')
const restify = require('restify')

const log = new Logger({
  name: 'DemocracyOS-api',
  level: 20,
  // streams: [
  //   {
  //     stream: process.stdout,
  //     level: 'debug'
  //   },
  //   {
  //     path: 'hello.log',
  //     level: 'trace'
  //   }
  // ],
  serializers: restify.bunyan.serializers
})

module.exports = log
