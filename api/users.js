const Router = require('restify-router').Router
const status = require('http-status')
// const log = require('../services/logger')
const router = new Router()
const {
  isLoggedIn,
  isAdmin,
  isOwner,
  isAdminOrOwner,
  allowedFieldsFor
} = require('../services/users')
const User = require('../db-api/user')

/**
 * GET /users
 */
router.get('', async (req, res, next) => {
  try {
    const results = await User.list({
      filter: req.query.filter,
      limit: req.query.limit,
      page: req.query.page,
      ids: req.query.ids,
      fields: allowedFieldsFor(req.user)
    })
    res.send(status.OK, {
      results: results.docs,
      pagination: {
        count: results.total,
        page: results.page,
        limit: results.limit
      }
    })
  } catch (err) {
    next(err)
  }
})

/**
 * POST /users
 */
router.post('', async (req, res, next) => {
  try {
    res.send(status.FORBIDDEN)
  } catch (err) {
    next(err)
  }
})

/**
 * GET /users/:id
 */
router.get('/:id',
  isOwner,
  async (req, res, next) => {
    try {
      const user = await User.get({ id: req.params.id }, allowedFieldsFor(req.user))
      res.send(status.OK, user)
    } catch (err) {
      next(err)
    }
  })

/**
 * PUT /users/:id
 */
router.put('/:id',
  isLoggedIn,
  isAdminOrOwner,
  async (req, res, next) => {
    try {
      let updatedUser = await User.update({ id: req.params.id, user: req.body })
      // If its not an admin, filter unalllowed fields.
      updatedUser = updatedUser.toJSON()
      let allowed = Object.keys(allowedFieldsFor(req.user))
      if (allowed.length) {
        Object.keys(updatedUser)
          .filter((key) => !allowed.includes(key))
          .forEach((key) => delete updatedUser[key])
      }
      res.send(status.OK, updatedUser)
    } catch (err) {
      next(err)
    }
  })

/**
 * DELETE /users/:id
 */
router.del('/:id',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      await User.remove(req.params.id)
      res.send(status.OK, { id: req.params.id })
    } catch (err) {
      next(err)
    }
  })

module.exports = router
