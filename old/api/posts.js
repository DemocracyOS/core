const express = require('express')
const status = require('http-status')
// const log = require('../services/logger')
const Post = require('../db-api/posts')
const {
  isLoggedIn,
  isAdmin
} = require('../services/users')
const router = express.Router()

router.route('/')
/**
 * GET /posts
 */
  .get(
    async (req, res, next) => {
      try {
        const results = await Post.list({
          filter: req.query.filter,
          sort: req.query.sort,
          limit: req.query.limit,
          page: req.query.page,
          ids: req.query.ids
        })
        // Sends the given results with status 200
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

// POST /posts
  .post(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        const newPost = await Post.create(req.body)
        res.status(status.CREATED).json(newPost)
      } catch (err) {
        next(err)
      }
    })

/**
 * GET /posts/:id
 */
router.route('/:id')
  .get(
    async (req, res, next) => {
      try {
        const post = await Post.get(req.params.id)
        res.status(status.OK).json(post)
      } catch (err) {
        next(err)
      }
    })
/**
 * UPDATE /posts/:id
 */
  .put(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        const updatedPost = await Post.update({ id: req.params.id, post: req.body })
        res.status(status.OK).json(updatedPost)
      } catch (err) {
        next(err)
      }
    })

/**
 * DELETE /posts/:id
 */
  .delete(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        await Post.remove(req.params.id)
        res.status(status.OK).json({ id: req.params.id })
      } catch (err) {
        next(err)
      }
    })

module.exports = router
