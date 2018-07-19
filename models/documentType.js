const mongoose = require('mongoose')
const version = require('mongoose-version')
const mongoosePaginate = require('mongoose-paginate')

// Define `Community` Schema
const DocumentType = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  description: { type: String, required: true },
  fields: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true, toJSON: { virtuals: true } })


// http://mongoosejs.com/docs/populate.html#populate-virtuals
DocumentType.virtual('versions', {
  ref: 'DocumentTypeVersion', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'refId', // is equal to `foreignField`
  // If `justOne` is true, 'versions' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false
})

// Model's Plugin Extensions
DocumentType.plugin(version, { collection: 'documenttypes_v', strategy: 'collection', suppressVersionIncrement: false })
DocumentType.plugin(mongoosePaginate)

// Expose `Community` Model
module.exports = mongoose.model('DocumentType', DocumentType)
