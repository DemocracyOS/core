// process.env.NODE_ENV

const Logger = require('bunyan')
const restify = require('restify')

const log = new Logger({
  name: 'DemocracyOS-api',
  level: 20,
  serializers: restify.bunyan.serializers
})

module.exports = log
