const express = require('express')
const status = require('http-status')
const log = require('../services/logger')
const Community = require('../db-api/community')
const auth = require('../services/auth')
const router = express.Router()

router.route('/')
  /**
   * @api {get} /community Get the community
   * @apiDescription Gets the settings of a community. If there is no community, it throws an error.
   * @apiName getCommunity
   * @apiGroup Community
   * @apiSuccess  {String}  name  The name of the community.
   * @apiSuccess  {String}  mainColor   The color of the community.
   * @apiSuccess  {String}  logo  The logo of the community.
   * @apiSuccess  {String}  user  The user who initialized the community.
   * @apiSuccess  {Boolean} initialized   If the community is ready..
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "firstname": "John",
   *       "lastname": "Doe"
   *     }
   * @apiError (500) INTERNAL_SERVER_ERROR The community have not been initialized'
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
  .post(
    // Only available for users with realm role 'admin'
    auth.protect('realm:admin'),
    async (req, res, next) => {
      try {
        // Create the community, with the reference to the user who created it.
        const dataCommunity = {
          name: req.body.name,
          mainColor: req.body.communityColor || '#425cf4',
          logo: req.body.communityFile || null,
          user: null,
          initialized: true
        }
        const newCommunity = await Community.create(dataCommunity)
        // if everything is ok. Show success
        res.status(status.OK).json(newCommunity)
      } catch (e) {
        log.error(e)
        res.render('error', { message: e.message })
      }
    }
  )
  /**
   * @api {put} /community Update the community
   * @apiPermission admin
   * @apiHeader {String} authorization Bearer JWT access token.
   * @apiDescription Updates the information of a community.
   * @apiName putCommunity
   * @apiGroup Community
   * @apiParam {String}  name  The name of the community.
   * @apiParam {String}  mainColor   The color of the community.
   * @apiParam {String}  logo  The logo of the community.
   * @apiParam {String}  user  The user who initialized the community.
   * @apiParam {Boolean} initialized   If the community is ready..
   */
  .put(
    auth.protect('realm:admin'),
    async (req, res, next) => {
      try {
        const updatedCommunity = await Community.update(req.body)
        res.status(status.OK).json(updatedCommunity)
      } catch (err) {
        console.log(err)
        next(err)
      }
    })

module.exports = router
