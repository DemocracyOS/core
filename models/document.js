const mongoose = require('mongoose')
const version = require('mongoose-version')
const mongoosePaginate = require('mongoose-paginate')

// Define `Community` Schema
const Document = new mongoose.Schema({
  authorId: { type: String, required: true }, // Keycloak Id?
  published: { type: Boolean, required: true },
  publishedAt: { type: Date, required: true },
  documentType: { type: mongoose.Schema.Types.ObjectId, ref: 'DocumentType' },
  documentTypeVersion: { type: Number, required: true },
  content: {
    title: { type: String, required: true },
    brief: { type: String, required: false },
    fields: { type: mongoose.Schema.Types.Mixed }
  }
}, {
  timestamps: true,
  versionKey: false
})

// Model's Plugin Extensions
Document.plugin(mongoosePaginate)

// Expose `Community` Model
module.exports = mongoose.model('Document', Document)
