const log = require('./logger')
const auth = require('../services/auth')
const {
  ErrUserNotLoggedIn,
  ErrNotAdmin,
  ErrNotAdminNorOwner
} = require('./errors')

const isAdmin = (token, request) => {
  return token.hasRole('realm:admin')
}

const allowedFieldsFor = (user) => {
  let selectedFields = {}
  if (user && user.role === 'admin') return {}
  if (user && user.isOwner) selectedFields.email = 1
  selectedFields._id = 1
  selectedFields.name = 1
  selectedFields.bio = 1
  selectedFields.username = 1
  selectedFields.createdAt = 1
  return selectedFields
}

module.exports = {
  isAdmin,
  allowedFieldsFor
}
