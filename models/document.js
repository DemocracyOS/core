const mongoose = require('mongoose')
// const version = require('mongoose-version')
const mongoosePaginate = require('mongoose-paginate')

// Define `Community` Schema
const Document = new mongoose.Schema({
  authorId: { type: String, required: true }, // Keycloak Id?
  published: { type: Boolean, required: true },
  customForm: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomForm' },
  content: {
    title: { type: String, required: true, maxlength: 120 },
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
