const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const timeago = require('../services/timeago')

const Comment = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  version: { type: mongoose.Schema.Types.ObjectId, ref: 'DocumentVersion' },
  field: { type: String },
  content: { type: String },
  resolved: { type: Boolean, default: false },
  decoration: { type: mongoose.Schema.Types.Mixed },
  when: { type: String }
}, { timestamps: true })

Comment.post('find', function (doc) {
  doc = doc.map((d) => {
    d.when = timeago().format(d.createdAt, 'es_AR')
    return d
  })
})

// Model's Plugin Extensions
Comment.plugin(mongoosePaginate)

// Expose `User` Model
module.exports = mongoose.model('Comment', Comment)
