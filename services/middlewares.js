
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
      if (req.session.userData) {
        // User data already on session. Continue!
        next()
      } else {
        // Find user in database with id from Keycloak
        let keycloakId = auth.getUserId(req)
        let user = await User.get({ keycloak: keycloakId })
        // Check if there is a user
        console.log(user)
        if (user) {
          // There is a user, bind it to the session!
          req.session.userData = user
          next()
        } else {
          // Create user
          let userCreated = await User.create({
            keycloak: keycloakId,
            username: 'thisisatest',
            avatar: 'GreatAvatar!',
            fields: null
          })
          // Bind to session
          req.session.userData = userCreated
          // Continue!
          next()
        }
      }
    } else {
      if (req.session.userData) {
        // User data in session. Need to be cleaned
        req.session.userData = null
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
