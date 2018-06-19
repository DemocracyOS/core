const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const User = new mongoose.Schema({
  authId: String,
  username: String,
  name: String,
  avatar: { data: Buffer, contentType: String },
  initialized: { type: Boolean, default: false }
}, { timestamps: true })

// Model's Plugin Extensions
User.plugin(mongoosePaginate)

// Expose `User` Model
module.exports = mongoose.model('User', User)
