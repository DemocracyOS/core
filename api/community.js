const express = require('express')
const status = require('http-status')
// const log = require('../services/logger')
const Community = require('../db-api/community')
const {
  isLoggedIn,
  isAdmin
} = require('../services/utils')
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
        const results = await Community.getOne()
        res.status(status.OK).json(results)
      } catch (err) {
        next(err)
      }
    })

/**
 * @api {post} /community Create a community
 * @apiDescription Creates a community. If there is a community already, it throws an error.
 * @apiName postCommunity
 * @apiGroup Community
 *
 */
  .post(
    async (req, res, next) => {
      try {
        // TODO
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
    async (req, res, next) => {
      try {
        // TODO
      } catch (err) {
        next(err)
      }
    })

module.exports = router
