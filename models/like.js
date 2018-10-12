const mongoose = require('mongoose')

const Like = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true
  }
}, { timestamps: true })

// Expose 'Like' model
module.exports = mongoose.model('Like', Like)