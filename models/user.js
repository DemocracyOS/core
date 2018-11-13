const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const immutablePlugin = require('mongoose-immutable')

const User = new mongoose.Schema({
  keycloak: { type: String, immutable: true },
  username: { type: String, immutable: true },
  fullname: { type: String },
  names: { type: String },
  surnames: { type: String },
  email: { type: String },
  roles: [{ type: String }],
  avatar: { type: String },
  fields: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true, minimize: false })

// Model's Plugin Extensions
User.plugin(mongoosePaginate)
User.plugin(immutablePlugin)

// Expose `User` Model
module.exports = mongoose.model('User', User)
