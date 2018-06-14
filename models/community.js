const mongoose = require('mongoose')

// Define `Community` Schema
const Community = new mongoose.Schema({
  name: { type: String, maxLength: 80, required: true },
  mainColor: { type: String, maxLength: 7, required: true, default: '#425cf4' },
  logo: { data: Buffer, contentType: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  init: { type: Boolean, default: false }
}, { timestamps: true })

// Expose `Community` Model
module.exports = mongoose.model('Community', Community)
