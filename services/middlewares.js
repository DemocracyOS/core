
const User = require('../db-api/user')
const errors = require('./errors')
const auth = require('./auth')
const defaultImage = 'data:image/png;base64,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'

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
              roles: auth.getRoles(req),
              avatar: defaultImage,
              fields: null
            })
            // Bind to session
            req.session.user = userCreated
          } else {
            await User.update(user._id, {
              fullname: auth.getFullname(req),
              names: auth.getNames(req),
              surnames: auth.getSurnames(req),
              email: auth.getEmail(req),
              roles: auth.getRoles(req)
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
            email: auth.getEmail(req),
            roles: auth.getRoles(req)
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
            roles: auth.getRoles(req),
            avatar: defaultImage,
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
