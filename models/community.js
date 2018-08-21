const mongoose = require('mongoose')

// Define `Community` Schema
const Community = new mongoose.Schema({
  name: { type: String, required: true },
  mainColor: { type: String, maxLength: 7, default: '#425cf4' },
  logo: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userProfileSchema: require('../snippets/jsonSchemaFields'),
  initialized: { type: Boolean, default: false }
}, { timestamps: true })

// Expose `Community` Model
module.exports = mongoose.model('Community', Community)
