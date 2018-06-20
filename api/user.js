const status = require('http-status')
const express = require('express')
const User = require('../db-api/user')
const router = express.Router()
const auth = require('../services/auth')
const { isAdmin } = require('../services/utils')
const log = require('../services/logger')

router.route('/')
/**
 * @api {get} /users List users
 * @apiName getUsers
 * @apiGroup User
 */
  .get(
    async (req, res, next) => {
      try {
        const results = await User.list({
          filter: req.query.filter,
          limit: req.query.limit,
          page: req.query.page,
          ids: req.query.ids,
          fields: {}
        })
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
 * @api {post} /users Create a new user
 * @apiName postUser
 * @apiGroup User
 */
  .post(async (req, res, next) => {
    try {
      // TODO
      // In discussion
    } catch (err) {
      next(err)
    }
  })
router.route('/:id')
/**
 * @api {get} /users/:id Gets a user
 * @apiName getUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users ID.
 */
  .get(
    async (req, res, next) => {
      try {
        // TODO
        // res.status(status.OK).json(user)
      } catch (err) {
        next(err)
      }
    })
/**
 * @api {put} /users/:id Updates a user
 * @apiName putUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users ID.
 */
  .put(
    async (req, res, next) => {
      try {
        // TODO
        // res.send(status.OK).json(updatedUser)
      } catch (err) {
        next(err)
      }
    })
/**
 * @api {delete} /users/:id Delets a user
 * @apiName deleteUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users ID.
 */
  .delete(
    async (req, res, next) => {
      try {
        // TODO
        // res.status(status.OK).json({ id: req.params.id })
      } catch (err) {
        next(err)
      }
    })

module.exports = router
