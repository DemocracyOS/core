const express = require('express')
const status = require('http-status')
// const log = require('../services/logger')
const Community = require('../db-api/community')
const auth = require('../services/auth')
const router = express.Router()

router.route('/')
/**
 * @api {get} /community Get the community
 * @apiDescription Gets the settings of a community. If there is no community, it throws an error.
 * @apiName getCommunity
 * @apiGroup Community
 *
 */
  .get(
    async (req, res, next) => {
      // returns Communitys only record
      try {
        const results = await Community.get()
        res.status(status.OK).json(results)
      } catch (err) {
        next(err)
      }
    })
/**
 * @api {put} /community Update the community
 * @apiDescription Updates the settings of a community.
 * @apiName putCommunity
 * @apiGroup Community
 *
 */
  .put(
    auth.protect('realm:admin'),
    async (req, res, next) => {
      try {
        const updatedCommunity = await Community.update(req.body)
        res.status(status.OK).json(updatedCommunity)
      } catch (err) {
        next(err)
      }
    })

module.exports = router
