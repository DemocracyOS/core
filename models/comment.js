const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const timeago = require('../services/timeago')

const Comment = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  field: { type: String },
  content: { type: String },
  resolved: { type: Boolean, default: false },
  when: { type: String }
}, { timestamps: true })

Comment.post('init', function(doc){
  doc.when = timeago().format(doc.createdAt, 'es_AR')
  return doc;
})

// Model's Plugin Extensions
Comment.plugin(mongoosePaginate)

// Expose `User` Model
module.exports = mongoose.model('Comment', Comment)
