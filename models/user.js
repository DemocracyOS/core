const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const immutablePlugin = require('mongoose-immutable')

const User = new mongoose.Schema({
  keycloak: { type: String, immutable: true },
  username: { type: String, immutable: true },
  avatar: { data: Buffer, contentType: String },
  fields: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true })

// Model's Plugin Extensions
User.plugin(mongoosePaginate)
User.plugin(immutablePlugin)

// Expose `User` Model
module.exports = mongoose.model('User', User)
