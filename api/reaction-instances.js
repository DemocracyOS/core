const Router = require('restify-router').Router
const status = require('http-status')
// const log = require('../services/logger')
const ReactionInstance = require('../db-api/reaction-instances')
const router = new Router()
const { isLoggedIn, isAdmin } = require('../services/users')

/**
 * GET /reaction-instances
 */
router.get('',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      const results = await ReactionInstance.list({ limit: req.query.limit, page: req.query.page })
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
 * POST /reaction-instances
 */
router.post('',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      const newReactionInstance = await ReactionInstance.create(req.body)
      res.send(status.CREATED, newReactionInstance)
    } catch (err) {
      next(err)
    }
  })

/**
 * GET /reaction-instances/:id
 */
router.get('/:id',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      const user = await ReactionInstance.get(req.params.id)
      res.send(status.OK, user)
    } catch (err) {
      next(err)
    }
  })

/**
 * PUT /reaction-instances/:id
 */
router.put('/:id',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      const updatedReactionInstance = await ReactionInstance.update({ id: req.params.id, reactionInstance: req.body })
      res.send(status.OK, updatedReactionInstance)
    } catch (err) {
      next(err)
    }
  })

/**
 * DELETE /reaction-instances/:id
 */
router.del('/:id',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      await ReactionInstance.remove(req.params.id)
      res.send(status.OK, { id: req.params.id })
    } catch (err) {
      next(err)
    }
  })

module.exports = router
