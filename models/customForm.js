const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const ignoredPaths = ['name', 'icon', 'description', 'updatedAt']

const CustomForm = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  icon: { type: String },
  description: { type: String, required: true },
  version: { type: Number },
  fields: {
    blocks: [
      {
        _id: false,
        name: { type: String },
        fields: [{ type: String }]
      }
    ],
    properties: { type: mongoose.Schema.Types.Mixed },
    required: [{ type: String }],
    richText: [{ type: String }],
    allowComments: [{ type: String }]
  }
}, {
  timestamps: true
})

const updateCurrentVersion = function (next) {
  // Following mongoose-version logic.
  // Before saving, if it is a new customForm for the collection, define currentVersion to 0
  if (this.isNew) {
    this.version = 0
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
        this.version = this.version + 1
        next()
      }
    }
    next()
  }
}

CustomForm.pre('save', updateCurrentVersion)
CustomForm.plugin(mongoosePaginate)

module.exports = mongoose.model('CustomForm', CustomForm)
