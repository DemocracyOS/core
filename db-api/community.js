const { Types: { ObjectId } } = require('mongoose')
const log = require('../services/logger')
const Community = require('../models/community')
const {
  ErrCommunitysInit,
  ErrCommunitysNotInit
} = require('../services/errors')

exports.create = function create (community) {
  return Community.findOne({})
    .then((_community) => {
      if (_community) throw ErrCommunitysInit
      return (new Community(community)).save()
    })
}

exports.get = function get () {
  return Community.findOne({})
    .then((community) => {
      if (community === null) throw ErrCommunitysNotInit
      return community
    })
}

// exports.get = function get (id) {
//   return Community.findOne({ _id: ObjectId(id) })
// }

// exports.list = function list ({ limit, page }) {
//   return Community
//     .paginate({}, { page, limit })
// }

exports.update = function update ({ id, community }) {
  return Community.findOne({ _id: ObjectId(id) })
    .then((_community) => Object.assign(_community, community).save())
}

// exports.remove = function remove (id) {
//   return Community.findOne({ _id: ObjectId(id) })
//     .then((community) => community.remove())
// }