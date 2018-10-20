const mongoose = require('mongoose')

// Define `Community` Schema
const Community = new mongoose.Schema({
  name: { type: String, required: true },
  mainColor: { type: String, maxLength: 7, default: '#425cf4' },
  logo: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userProfileSchema: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomForm' },
  initialized: { type: Boolean, default: false },
  permissions: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true, minimize: false })

let autoPopulate = function (next) {
  this.populate('userProfileSchema')
  next()
}

Community
  .pre('findOne', autoPopulate)
  .pre('find', autoPopulate)

// Expose `Community` Model
module.exports = mongoose.model('Community', Community)
