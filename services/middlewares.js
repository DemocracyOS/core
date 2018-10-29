
const User = require('../db-api/user')
const errors = require('./errors')
const auth = require('./auth')

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

exports.bindUserToSession = async (req, res, next) => {
  try {
    // Check if there is a keycloak user in req
    if (auth.isAuthenticated(req)) {
      // Check if thre is userData in the session
      let keycloakId = auth.getUserId(req)
      if (req.session.user) {
        // User data already on session.
        if (req.session.user.keycloak !== keycloakId) {
          let user = await User.get({ keycloak: keycloakId })
          if (!user) {
            // Create user
            let userCreated = await User.create({
              keycloak: keycloakId,
              username: auth.getUsername(req),
              fullname: auth.getFullname(req),
              names: auth.getNames(req),
              surnames: auth.getSurnames(req),
              email: auth.getEmail(req),
              avatar: null,
              fields: null
            })
            // Bind to session
            req.session.user = userCreated
          } else {
            await User.update(user._id, {
              fullname: auth.getFullname(req),
              names: auth.getNames(req),
              surnames: auth.getSurnames(req),
              email: auth.getEmail(req)
            })
          }
        }
        // Continue!
        next()
      } else {
        // Find user in database with id from Keycloak
        let user = await User.get({ keycloak: keycloakId })
        // Check if there is a user
        // console.log(user)
        if (user) {
          // There is a user, bind it to the session!
          await User.update(user._id, {
            fullname: auth.getFullname(req),
            names: auth.getNames(req),
            surnames: auth.getSurnames(req),
            email: auth.getEmail(req)
          })
          req.session.user = user
          next()
        } else {
          // Create user
          let userCreated = await User.create({
            keycloak: keycloakId,
            username: auth.getUsername(req),
            fullname: auth.getFullname(req),
            names: auth.getNames(req),
            surnames: auth.getSurnames(req),
            email: auth.getEmail(req),
            avatar: null,
            fields: null
          })
          // Bind to session
          req.session.user = userCreated
          // Continue!
          next()
        }
      }
    } else {
      if (req.session.user) {
        // User data in session. Need to be cleaned
        req.session.user = null
        next()
      } else {
        // No user data in session. Continue!
        next()
      }
    }
  } catch (err) {
    next(err)
  }
}

exports.addPaginationParams = async (req, res, next) => {
  if (req.query.limit <= 10) req.query.limit = 10
  next()
}
