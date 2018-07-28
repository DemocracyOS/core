const mongoose = require('mongoose')
const version = require('mongoose-version')
const mongoosePaginate = require('mongoose-paginate')
const DocumentTypeVersion = require('./documentTypeVersion')
const ignoredPaths = ['name', 'icon', 'description', 'updatedAt']

// Define `Community` Schema
const DocumentType = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  description: { type: String, required: true },
  currentVersion: { type: Number },
  fields: {
    blocks: [
      {
        name: { type: String },
        fields: [{ type: String }]
      }
    ],
    properties: { type: mongoose.Schema.Types.Mixed },
    required: [{ type: String }]
  }
}, {
  timestamps: true,
  versionKey: false
/*, toJSON: { virtuals: true } */
})

// http://mongoosejs.com/docs/populate.html#populate-virtuals
// DocumentType.virtual('versionContainer', {
//   ref: 'DocumentTypeVersion', // The model to use
//   localField: '_id', // Find people where `localField`
//   foreignField: 'refId', // is equal to `foreignField`
//   // If `justOne` is true, 'versions' will be a single doc as opposed to
//   // an array. `justOne` is false by default.
//   justOne: true
// })

let updateCurrentVersion = function (next) {
  // Following mongoose-version logic.
  // Before saving, if it is a new document for the collection, define currentVersion to 0
  console.log(this)
  if (this.isNew) {
    this.currentVersion = 0
    next()
  } else {
    // If it is not new, check which paths were modified
    let modifiedPaths = this.modifiedPaths()
    if (modifiedPaths.length) {
      let onlyIgnoredPathModified = modifiedPaths.every(function (path) {
        return ignoredPaths.indexOf(path) >= 0
      })
      if (onlyIgnoredPathModified) {
        // If the ignored paths were modified, do nothing
        next()
      } else {
        // If the fields changed, then it defines a new current version.
        this.currentVersion = this.currentVersion + 1
        next()
      }
    }
  }
}
// let show = async function (doc) {
//   doc.currentVersion = doc.toJSON().versionContainer.__v
// }

DocumentType
  .pre('save', updateCurrentVersion)

// Model's Plugin Extensions
DocumentType.plugin(version, { collection: 'documenttypes_versions', ignorePaths: ignoredPaths })
DocumentType.plugin(mongoosePaginate)

// Expose `Community` Model
module.exports = mongoose.model('DocumentType', DocumentType)
