const path = require('path')
const express = require('express')
const auth = require('../services/auth')
// const status = require('http-status')
// Utils
const log = require('../services/logger')
const errors = require('../services/errors')
// Create Router
const router = express.Router() // api/v1 route wrapper
// Models
const User = require('../db-api/user')
const Community = require('../db-api/community')
// const { NODE_ENV } = process.env

router.use('/assets', express.static(path.join(__dirname, './assets')))

router.route('/')
  .get(
    // Only available for users with realm role 'admin'
    auth.protect('realm:admin'),
    async (req, res, next) => {
      try {
        const community = await Community.get()
        const noUsers = await User.isEmpty()
        // If there are users in the database, we assume the app was initialized before
        if (noUsers) {
          res.render('error', { message: 'You cannot start a new community when there are users already in database' })
        }
        // If there is a community, we assume the app was initialized before
        if (community !== null) {
          res.render('success', { name: req.kauth.grant.access_token.content.given_name })
        }
      } catch (e) {
        if (e instanceof errors.APIError && e.translationKey === 'COMMUNITY_NOT_INIT') {
          // If the community is already initialized, start the setup flow
          res.render('index', {
            name: req.kauth.grant.access_token.content.name,
            email: req.kauth.grant.access_token.content.email,
            roles: req.kauth.grant.access_token.content.realm_access.roles.join(', ')
          })
        } else {
          log.error(e)
        }
      }
    }
  )

router.route('/init')
  .post(
    // Only available for users with realm role 'admin'
    auth.protect('realm:admin'),
    async (req, res, next) => {
      try {
        // TODO: Validation?
        // Create the user
        const dataUser = {
          authId: req.kauth.grant.access_token.content.sub,
          email: req.kauth.grant.access_token.content.email,
          name: req.kauth.grant.access_token.content.name,
          avatar: null,
          initialized: true
        }
        const user = await User.create(dataUser)
        // Create the community, with the reference to the user who created it.
        const dataCommunity = {
          name: req.body.communityName,
          mainColor: req.body.communityColor || '#425cf4',
          logo: req.body.communityFile || null,
          user: user._id,
          initialized: true
        }
        await Community.create(dataCommunity)
        // if everything is ok. Show success
        res.render('success', { name: req.kauth.grant.access_token.content.given_name })
      } catch (e) {
        log.error(e)
        res.render('error', { message: e.message })
      }
    }
  )

module.exports = router
