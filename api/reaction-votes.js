const express = require('express')
const status = require('http-status')
const ReactionVote = require('../db-api/reaction-votes')
const { isLoggedIn, isAdmin } = require('../services/users')
const router = express.Router()

/**
 * GET /reaction-votes
 */
router.route('/')
  .get(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        const results = await ReactionVote.list({ limit: req.query.limit, page: req.query.page, ids: req.query.ids })
        res.status(status.OK).json({
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
  .post(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        res.status(status.FORBIDDEN).end()
      } catch (err) {
        next(err)
      }
    })

router.route('/:id')
/**
 * GET /reaction-votes/:id
 */
  .get(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        const user = await ReactionVote.get(req.params.id)
        res.status(status.OK).json(user).end()
      } catch (err) {
        next(err)
      }
    })
/**
 * PUT /reaction-votes/:id
 */
  .put(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
      // const updatedReactionVote = await ReactionVote.update({ id: req.params.id, reactionVote: req.body })
      // res.status(OK).json(updatedReactionVote)
        res.status(status.FORBIDDEN).end()
      } catch (err) {
        next(err)
      }
    })
/**
 * DELETE /reaction-votes/:id
 */
  .delete(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
      // await ReactionVote.remove(req.params.id)
      // res.status(OK).json({ id: req.params.id })
        res.status(status.FORBIDDEN).end()
      } catch (err) {
        next(err)
      }
    })

module.exports = router
