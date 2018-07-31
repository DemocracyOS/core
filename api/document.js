const status = require('http-status')
const express = require('express')
const Document = require('../db-api/document')
const router = express.Router()
const auth = require('../services/auth')
const { isAdmin } = require('../services/utils')
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
        const results = await Document.list({
          filter: req.query.filter,
          limit: req.query.limit,
          page: req.query.page,
          ids: req.query.ids,
          fields: {}
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
    auth.protect('realm:colaborator'),
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
        // TODO
        // res.status(status.OK).json(document)
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
