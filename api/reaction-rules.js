const Router = require('restify-router').Router
const status = require('http-status')
// const log = require('../services/logger')
const ReactionRule = require('../db-api/reaction-rules')
const router = new Router()
const { isLoggedIn, isAdmin } = require('../services/users')

/**
 * GET /reaction-rules
 */
router.get('',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      let results = []
      results = results = await ReactionRule.list({ filter: req.query.filter, limit: req.query.limit, page: req.query.page, ids: req.query.ids })
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
 * POST /reaction-rules
 */
router.post('',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      const newReactionRule = await ReactionRule.create(req.body)
      res.send(status.CREATED, newReactionRule)
    } catch (err) {
      next(err)
    }
  })

/**
 * GET /reaction-rules/:id
 */
router.get('/:id',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      const user = await ReactionRule.get(req.params.id)
      res.send(status.OK, user)
    } catch (err) {
      next(err)
    }
  })

/**
 * PUT /reaction-rules/:id
 */
router.put('/:id',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      const updatedReactionRule = await ReactionRule.update({ id: req.params.id, reactionRule: req.body })
      res.send(status.OK, updatedReactionRule)
    } catch (err) {
      next(err)
    }
  })

/**
 * DELETE /reaction-rules/:id
 */
router.del('/:id',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      await ReactionRule.remove(req.params.id)
      res.send(status.OK, { id: req.params.id })
    } catch (err) {
      next(err)
    }
  })

module.exports = router
