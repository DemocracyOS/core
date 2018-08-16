
const mongoose = require('mongoose')
const errors = require('./errors')

exports.checkId = async (req, res, next) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      throw errors.ErrNotFound()
    }
    next()
  } catch (err) {
    next(err)
  }
}
