const { Types: { ObjectId } } = require('mongoose')
const log = require('../services/logger')
const Community = require('../models/community')
const {
  ErrCommunitysNotInit
} = require('../services/errors')

exports.get = function get () {
  return Community.findOne({})
    .then((community) => {
      if (community === null) throw ErrCommunitysNotInit
      return community
    })
}

exports.update = function update (community) {
  return Community.findOne({})
    .then((_community) => Object.assign(_community, community).save())
}
