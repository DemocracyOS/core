const mongoose = require('mongoose')
const version = require('mongoose-version')

// Define `Community` Schema
const DocumentType = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  description: { type: String, required: true },
  fields: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true })

DocumentType.plugin(version, { collection: 'documenttypes_v' })

// Expose `Community` Model
module.exports = mongoose.model('DocumentType', DocumentType)
