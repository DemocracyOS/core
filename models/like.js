const mongoose = require('mongoose')

const Like = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }
})

// Expose 'Like' model
module.exports = mongoose.model('Like', Like)