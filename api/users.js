const Router = require('restify-router').Router
const status = require('http-status')
const log = require('../services/logger')
const router = new Router()
const {
  isLoggedIn,
  isAdmin,
  isOwner,
  isAdminOrOwner,
  allowedFieldsFor
} = require('../services/users')
const User = require('../db-api/user')

router.post('', async (req, res, next) => {
  try {
    res.send(status.FORBIDDEN)
  } catch (err) {
    next(err)
  }
})

router.get('', async (req, res, next) => {
  try {
    const results = await User.list({ filter: req.query.filter, limit: req.paginate.per_page, page: req.paginate.page, ids: req.query.ids, fields: allowedFieldsFor(req.user) })
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

router.get('/:id',
  isOwner,
  async (req, res, next) => {
    try {
      const user = await User.get({ id: req.params.id }, allowedFieldsFor(req.user))
      res.send(status.OK, user)
    } catch (err) {
      next(err)
    }
  })

router.put('/:id',
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
      res.send(status.OK, updatedUser)
    } catch (err) {
      next(err)
    }
  })

router.del('/:id',
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      await User.remove(req.params.id)
      res.send(status.OK, { id: req.params.id })
    } catch (err) {
      next(err)
    }
  })

module.exports = router

// const express = require('express')
// const {
//   OK,
//   CREATED,
//   NO_CONTENT,
//   FORBIDDEN,
//   NOT_FOUND
// } = require('http-status')
// const User = require('../db-api/user')
// const {
//   isLoggedIn,
//   isAdmin,
//   isOwner,
//   isAdminOrOwner,
//   allowedFieldsFor
// } = require('../../services/users')
// const {
//   ErrNotFound
// } = require('../../main/errors')
// const router = express.Router()

// router.route('/')
//   .post(
//     // isLoggedIn,
//     async (req, res, next) => {
//       try {
//         res.status(FORBIDDEN).end()
//         // throw ErrNotFound
//       //   await User.create(req.body)
//       //   res.status(CREATED).end()
//       } catch (err) {
//         next(err)
//       }
//     })
//   .get(
//     isLoggedIn,
//     async (req, res, next) => {
//       try {
//         const results = await User.list({ filter: req.query.filter, limit: req.query.limit, page: req.query.page, ids: req.query.ids, fields: allowedFieldsFor(req.user) })
//         res.status(OK).json({
//           results: results.docs,
//           pagination: {
//             count: results.total,
//             page: results.page,
//             limit: results.limit
//           }
//         })
//       } catch (err) {
//         next(err)
//       }
//     })

// router.route('/:id')
//   .get(
//     isOwner,
//     async (req, res, next) => {
//       try {
//         const user = await User.get({ id: req.params.id }, allowedFieldsFor(req.user))
//         res.status(OK).json(user)
//       } catch (err) {
//         next(err)
//       }
//     })
//   .put(
//     isLoggedIn,
//     isAdminOrOwner,
//     async (req, res, next) => {
//       try {
//         let updatedUser = await User.update({ id: req.params.id, user: req.body })
//         // If its not an admin, filter unalllowed fields.
//         updatedUser = updatedUser.toJSON()
//         let allowed = Object.keys(allowedFieldsFor(req.user))
//         if (allowed.length) {
//           Object.keys(updatedUser)
//             .filter((key) => !allowed.includes(key))
//             .forEach((key) => delete updatedUser[key])
//         }
//         res.status(OK).json(updatedUser)
//       } catch (err) {
//         next(err)
//       }
//     })
//   .delete(
//     isLoggedIn,
//     isAdmin,
//     async (req, res, next) => {
//       try {
//         await User.remove(req.params.id)
//         res.status(OK).json({ id: req.params.id })
//       } catch (err) {
//         next(err)
//       }
//     })

// module.exports = router
