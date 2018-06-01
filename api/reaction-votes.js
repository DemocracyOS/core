const Router = require('restify-router').Router
const status = require('http-status')
// const log = require('../services/logger')
const ReactionVote = require('../db-api/reaction-votes')
const router = new Router()
const { isLoggedIn, isAdmin } = require('../services/users')

/**
 * GET /reaction-votes
 */
router.get('',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      const results = await ReactionVote.list({ limit: req.query.limit, page: req.query.page, ids: req.query.ids })
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
 * POST /reaction-votes
 */
router.post('',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      res.send(status.FORBIDDEN)
    } catch (err) {
      next(err)
    }
  })

/**
 * GET /reaction-votes/:id
 */
router.get('/:id',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      const user = await ReactionVote.get(req.params.id)
      res.send(status.OK, user)
    } catch (err) {
      next(err)
    }
  })

/**
 * PUT /reaction-votes/:id
 */
router.put('/:id',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      // const updatedReactionVote = await ReactionVote.update({ id: req.params.id, reactionVote: req.body })
      // res.status(OK).json(updatedReactionVote)
      res.send(status.FORBIDDEN)
    } catch (err) {
      next(err)
    }
  })

/**
 * DELETE /reaction-votes/:id
 */
router.del('/:id',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      // await ReactionVote.remove(req.params.id)
      // res.status(OK).json({ id: req.params.id })
      res.send(status.FORBIDDEN)
    } catch (err) {
      next(err)
    }
  })

module.exports = router
