const express = require('express')
const status = require('http-status')
// const log = require('../services/logger')
const Setting = require('../db-api/settings')
const {
  isLoggedIn,
  isAdmin
} = require('../services/users')
const router = express.Router()

router.route('/')
/**
 * GET /settings
 */
  .get(
    async (req, res, next) => {
      // returns Settings only record
      try {
        const results = await Setting.getOne()
        res.status(status.OK).json(results)
      } catch (err) {
        next(err)
      }
    })

/**
 * POST /settings
 */
  .post(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        const newSetting = await Setting.create(req.body)
        res.status(status.CREATED).json({
          data: newSetting
        })
      } catch (err) {
        next(err)
      }
    })

router.route('/:id')
/**
 * GET /settings/:id
 */
  .get(
    async (req, res, next) => {
      try {
        const setting = await Setting.get(req.params.id)
        res.status(status.OK).json(setting)
      } catch (err) {
        next(err)
      }
    })
/**
 * PUT /settings/:id
 */
  .put(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        const updatedSetting = await Setting.update({ id: req.params.id, setting: req.body })
        res.status(status.OK).json(updatedSetting)
      } catch (err) {
        next(err)
      }
    })
/**
 * DELETE /settings/:id
 */
  .delete(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        await Setting.remove(req.params.id)
        res.status(status.OK).json({ id: req.params.id })
      } catch (err) {
        next(err)
      }
    })

module.exports = router
