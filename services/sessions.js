const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('./mongoose')

const mongoStore = new MongoStore({
  mongooseConnection: mongoose.connection,
  collection: 'sessions',
  stringify: false
})

module.exports = mongoStore
