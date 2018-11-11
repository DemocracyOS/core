const Like = require('../models/like')
const { ErrNotFound } = require('../services/errors')

exports.get = function get (query) {
  return Like.findOne(query)
}

exports.getAll = function get (query) {
  return Like.find(query)
}

exports.create = function create (likeData) {
  return (new Like(likeData)).save()
}

exports.remove = function remove (id) {
  return Like.findById(id)
    .then((like) => {
      if (!like) throw ErrNotFound('Like to remove not found')
      return like.remove()
    })
}
