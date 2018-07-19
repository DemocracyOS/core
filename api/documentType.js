const status = require('http-status')
const express = require('express')
const DocumentType = require('../db-api/documentType')
const router = express.Router()
const auth = require('../services/auth')
const log = require('../services/logger')

router.route('/')
  /**
   * @api {get} /document-types List document types
   * @apiName getDocumentType
   * @apiGroup DocumentType
   */
  .get(
    async (req, res, next) => {
      try {
        const results = await DocumentType.list({
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
   * @api {post} /document-types Create a new documentType
   * @apiName postDocumentType
   * @apiGroup DocumentType
   */
  .post(
    auth.protect('realm:admin'),
    async (req, res, next) => {
      try {
        const dataDocumentType = {
          name: req.body.name,
          icon: req.body.icon,
          description: req.body.description,
          fields: req.body.fields
        }
        const newDocumentType = await DocumentType.create(dataDocumentType)
        res.status(status.CREATED).json(newDocumentType)
      } catch (err) {
        next(err)
      }
    })
router.route('/:id')
  /**
   * @api {get} /document-types/:id Gets a documentType
   * @apiName getDocumentType
   * @apiGroup DocumentType
   *
   * @apiParam {Number} id DocumentTypes ID.
   */
  .get(
    async (req, res, next) => {
      try {
        const documentType = await DocumentType.get(req.params.id)
        res.status(status.OK).json(documentType)
      } catch (err) {
        next(err)
      }
    })
  /**
   * @api {put} /document-types/:id Updates a documentType
   * @apiName putDocumentType
   * @apiGroup DocumentType
   *
   * @apiParam {Number} id DocumentTypes ID.
   */
  .put(
    auth.protect('realm:admin'),
    async (req, res, next) => {
      try {
        const updatedDocumentType = await DocumentType.update({ id: req.params.id, documentType: req.body })
        res.status(status.OK).json(updatedDocumentType)
      } catch (err) {
        next(err)
      }
    })
  /**
   * @api {delete} /document-types/:id Delets a documentType
   * @apiName deleteDocumentType
   * @apiGroup DocumentType
   *
   * @apiParam {Number} id DocumentTypes ID.
   */
  .delete(
    auth.protect('realm:admin'),
    async (req, res, next) => {
      try {
        // TODO
        // Shouldn't delete a document type if there is a document already using it
        // res.status(status.OK).json({ id: req.params.id })
      } catch (err) {
        next(err)
      }
    })

module.exports = router
