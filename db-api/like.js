const Like = require('../models/like')
const { ErrNotFound } = require('../services/errors');

exports.get = function get(query) {
  return Like.findOne(query)
}

exports.create = function create(likeData) {
  return (new Like(likeData)).save()
}

exports.remove = function remove(userId, commentId) {
  return Like.findOne({user: userId, comment: commentId})
    .then((like) => {
      if (!like) throw ErrNotFound('Like to remove not found')
      return like.remove()
    })
}