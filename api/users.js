const status = require('http-status')
const express = require('express')
const {
  isLoggedIn,
  isAdmin,
  isOwner,
  isAdminOrOwner,
  allowedFieldsFor
} = require('../services/users')
const User = require('../db-api/user')
const router = express.Router()

router.route('/')
/**
 * GET /users
 */
  .get(async (req, res, next) => {
    try {
      const results = await User.list({
        filter: req.query.filter,
        limit: req.query.limit,
        page: req.query.page,
        ids: req.query.ids,
        fields: allowedFieldsFor(req.user)
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
 * POST /users
 */
  .post(async (req, res, next) => {
    try {
      res.status(status.FORBIDDEN).end()
    } catch (err) {
      next(err)
    }
  })
router.route('/:id')
/**
 * GET /users/:id
 */
  .get(
    isOwner,
    async (req, res, next) => {
      try {
        const user = await User.get({ id: req.params.id }, allowedFieldsFor(req.user))
        res.status(status.OK).json(user)
      } catch (err) {
        next(err)
      }
    })
/**
 * PUT /users/:id
 */
  .put(
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
        res.send(status.OK).json(updatedUser)
      } catch (err) {
        next(err)
      }
    })
/**
 * DELETE /users/:id
 */
  .delete(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        await User.remove(req.params.id)
        res.status(status.OK).json({ id: req.params.id })
      } catch (err) {
        next(err)
      }
    })

module.exports = router
