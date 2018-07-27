const status = require('http-status')
const express = require('express')
const DocumentType = require('../db-api/documentType')
const DocumentTypeVersion = require('../db-api/documentTypeVersion')
const router = express.Router()
const auth = require('../services/auth')
const log = require('../services/logger')

router.route('/')
  /**
   * @api {get} /document-types List
   * @apiDescription Returns a list of available document types. Only brings the latests versions of the document types. If you need the versions of each document type, add the query parameter `versions=true`
   * @apiName getDocumentTypes
   * @apiGroup DocumentType
   * @apiParam {boolean} versions Query parameter. Optional. Retrieves all the versions of all the available document Types if `true`
   */
  .get(
    async (req, res, next) => {
      try {
        const documentType = await DocumentType.get()
        res.status(status.OK).json(documentType)
      } catch (err) {
        next(err)
      }
    })
  /**
   * @api {post} /document-types Create
   * @apiDescription Creates a new documentType
   * @apiName postDocumentType
   * @apiGroup DocumentType
   */
  .put(
    auth.protect('realm:admin'),
    async (req, res, next) => {
      try {
        const updatedDocumentType = await DocumentType.update(req.body)
        res.status(status.OK).json(updatedDocumentType)
      } catch (err) {
        next(err)
      }
    })

module.exports = router
