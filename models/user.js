const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const User = new mongoose.Schema({
  keycloak: String,
  username: String,
  avatar: { data: Buffer, contentType: String },
  fields: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true })

// Model's Plugin Extensions
User.plugin(mongoosePaginate)

// Expose `User` Model
module.exports = mongoose.model('User', User)
