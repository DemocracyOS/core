const Keycloak = require('keycloak-connect')
const { KEYCLOAK_CONFIG } = require('../config')
const mongoStore = require('./sessions')

const keycloak = new Keycloak({ store: mongoStore }, KEYCLOAK_CONFIG)

const getUserId = (req) => {
  if (req.kauth && req.kauth.grant) {
    return req.kauth.grant.access_token.content.sub
  } else {
    return null
  }
}

const getUsername = (req) => {
  if (req.kauth && req.kauth.grant) {
    return req.kauth.grant.access_token.content.preferred_username
  } else {
    return null
  }
}
const getNames = (req) => {
  if (req.kauth && req.kauth.grant) {
    return req.kauth.grant.access_token.content.given_name
  } else {
    return null
  }
}
const getEmail = (req) => {
  if (req.kauth && req.kauth.grant) {
    return req.kauth.grant.access_token.content.email
  } else {
    return null
  }
}
const getUsernames = (req) => {
  if (req.kauth && req.kauth.grant) {
    return req.kauth.grant.access_token.content.family_name
  } else {
    return null
  }
}

const getFullname = (req) => {
  if (req.kauth && req.kauth.grant) {
    return req.kauth.grant.access_token.content.name
  } else {
    return null
  }
}

const isAuthenticated = (req) => {
  if (req.kauth && req.kauth.grant) {
    return true
  } else {
    return false
  }
}

const hasRealmRole = (req, roleName) => {
  if (req.kauth && req.kauth.grant) {
  // Make sure we have these properties before we check for a certain realm level role!
  // Without this we attempt to access an undefined property on token
  // for a user with no realm level roles
    if (!req.kauth.grant.access_token.content.realm_access || !req.kauth.grant.access_token.content.realm_access.roles) {
      return false
    }
    // console.log(req.kauth.grant.access_token.content.realm_access.roles)
    return (req.kauth.grant.access_token.content.realm_access.roles.indexOf(roleName) >= 0)
  }

  return false
}

const getPermissions = (req) => {
  if (req.kauth && req.kauth.grant) {
    return req.kauth.grant.access_token.content.permissions
  } else {
    return null
  }
}

module.exports = {
  keycloak,
  isAuthenticated,
  hasRealmRole,
  getUserId,
  getPermissions,
  getUsername,
  getNames,
  getEmail,
  getUsernames,
  getFullname
}
