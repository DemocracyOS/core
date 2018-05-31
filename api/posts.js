const Router = require('restify-router').Router
const status = require('http-status')
// const log = require('../services/logger')
const Post = require('../db-api/posts')
const router = new Router()
const {
  isLoggedIn,
  isAdmin
} = require('../services/users')

/**
 * GET /posts
 */
router.get('',
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

// POST /posts
router.post('',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      const newPost = await Post.create(req.body)
      res.send(status.CREATED, newPost)
    } catch (err) {
      next(err)
    }
  })

/**
 * GET /posts/:id
 */
router.get('/:id',
  async (req, res, next) => {
    try {
      const post = await Post.get(req.params.id)
      res.send(status.OK, post)
    } catch (err) {
      next(err)
    }
  })
/**
 * UPDATE /posts/:id
 */
router.put('/:id',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      const updatedPost = await Post.update({ id: req.params.id, post: req.body })
      res.send(status.OK, updatedPost)
    } catch (err) {
      next(err)
    }
  })

/**
 * DELETE /posts/:id
 */
router.del('/:id',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      await Post.remove(req.params.id)
      res.send(status.OK, { id: req.params.id })
    } catch (err) {
      next(err)
    }
  })

module.exports = router
