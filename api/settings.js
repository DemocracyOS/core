const Router = require('restify-router').Router
const status = require('http-status')
// const log = require('../services/logger')
const Setting = require('../db-api/settings')
const router = new Router()
const {
  isLoggedIn,
  isAdmin
} = require('../services/users')

/**
 * GET /settings
 */
router.get('',
  async (req, res, next) => {
  // returns Settings only record
    try {
      const results = await Setting.getOne()
      res.send(status.OK, results)
    } catch (err) {
      next(err)
    }
  })

/**
 * POST /settings
 */
router.post('',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      const newSetting = await Setting.create(req.body)
      res.send(status.CREATED, {
        data: newSetting
      })
    } catch (err) {
      next(err)
    }
  })

/**
 * GET /settings/:id
 */
router.get('/:id',
  async (req, res, next) => {
    try {
      const setting = await Setting.get(req.params.id)
      res.send(status.OK, setting)
    } catch (err) {
      next(err)
    }
  })

/**
 * PUT /settings/:id
 */
router.put('/:id',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      const updatedSetting = await Setting.update({ id: req.params.id, setting: req.body })
      res.send(status.OK, updatedSetting)
    } catch (err) {
      next(err)
    }
  })

/**
 * DELETE /settings/:id
 */
router.del('/:id',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      await Setting.remove(req.params.id)
      res.send(status.OK, { id: req.params.id })
    } catch (err) {
      next(err)
    }
  })

module.exports = router
