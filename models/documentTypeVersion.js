const mongoose = require('mongoose')

// Define `Community` Schema
const DocumentTypeVersion = new mongoose.Schema({}, { collection: 'documenttypes_versions', strict: false })

// Expose `Community` Model
module.exports = mongoose.model('DocumentTypeVersion', DocumentTypeVersion)
