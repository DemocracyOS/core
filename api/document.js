const status = require('http-status')
const express = require('express')
const Document = require('../db-api/document')
const router = express.Router()
const auth = require('../services/auth')
const errors = require('../services/errors')
const log = require('../services/logger')
// const {
//   ErrMissingParam,
//   ErrNotFound,
//   ErrParamTooLong
// } = require('../services/errors')
router.route('/')
  /**
   * @api {get} /documents List documents
   * @apiName getDocuments
   * @apiGroup Document
   */
  .get(
    async (req, res, next) => {
      try {
        const results = await Document.list({}, {
          limit: req.query.limit,
          page: req.query.page
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
   * @api {post} /documents Create a new document
   * @apiName postDocument
   * @apiGroup Document
   */
  .post(
    auth.keycloak.protect('realm:responsible'),
    async (req, res, next) => {
      try {
        const newDocument = await Document.create(req.body)
        res.send(status.CREATED, newDocument)
      } catch (err) {
        next(err)
      }
    })
router.route('/:id')
  /**
   * @api {get} /documents/:id Gets a document
   * @apiName getDocument
   * @apiGroup Document
   *
   * @apiParam {Number} id Documents ID.
   */
  .get(
    async (req, res, next) => {
      try {
        let document = null
        // Does the request comes from a responsible?
        if (auth.isAuthenticated(req) && auth.hasRealmRole(req, 'responsible')) {
          // It does, get the document, no matter if published or not.
          document = await Document.get({ _id: req.params.id })
          // If it doesnt exists, return null
          if (!document) res.status(status.OK).json(document)
          // What if its a draft? Only the author should be able to see it
          if (!document.published) {
            // It's a draft, check if the author is the user who requested it.
            if (document.authorId === auth.getUserId(req)) {
              // True! Deliver the document
              res.status(status.OK).json(document)
            } else {
              // No, Then the user shouldn't be asking for this document.
              throw errors.ErrForbidden
            }
          }
        } else {
          // The request doesn't come from a possible author, then it should return a document if it exists and if it is published.
          document = await Document.get({ _id: req.params.id, published: true })
        }
        res.status(status.OK).json(document)
      } catch (err) {
        next(err)
      }
    })
  /**
   * @api {put} /documents/:id Updates a document
   * @apiName putDocument
   * @apiGroup Document
   *
   * @apiParam {Number} id Documents ID.
   */
  .put(
    async (req, res, next) => {
      try {
        // TODO
        // res.send(status.OK).json(updatedDocument)
      } catch (err) {
        next(err)
      }
    })
  /**
   * @api {delete} /documents/:id Delets a document
   * @apiName deleteDocument
   * @apiGroup Document
   *
   * @apiParam {Number} id Documents ID.
   */
  .delete(
    async (req, res, next) => {
      try {
        // TODO
        // res.status(status.OK).json({ id: req.params.id })
      } catch (err) {
        next(err)
      }
    })

module.exports = router
