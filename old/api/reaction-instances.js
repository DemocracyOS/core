const express = require('express')
const status = require('http-status')
// const log = require('../services/logger')
const ReactionInstance = require('../db-api/reaction-instances')
const router = express.Router()
const { isLoggedIn, isAdmin } = require('../services/users')

/**
 * GET /reaction-instances
 */
router.route('/')
  .get(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        const results = await ReactionInstance.list({ limit: req.query.limit, page: req.query.page })
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
 * POST /reaction-instances
 */
  .post(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        const newReactionInstance = await ReactionInstance.create(req.body)
        res.status(status.CREATED).json(newReactionInstance)
      } catch (err) {
        next(err)
      }
    })

router.route('/:id')
/**
 * GET /reaction-instances/:id
 */
  .get(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        const user = await ReactionInstance.get(req.params.id)
        res.status(status.OK).json(user)
      } catch (err) {
        next(err)
      }
    })

/**
 * PUT /reaction-instances/:id
 */
  .put(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        const updatedReactionInstance = await ReactionInstance.update({ id: req.params.id, reactionInstance: req.body })
        res.status(status.OK).json(updatedReactionInstance)
      } catch (err) {
        next(err)
      }
    })
  .delete(
    /**
     * DELETE /reaction-instances/:id
     */
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        await ReactionInstance.remove(req.params.id)
        res.status(status.OK).json({ id: req.params.id })
      } catch (err) {
        next(err)
      }
    })

module.exports = router
