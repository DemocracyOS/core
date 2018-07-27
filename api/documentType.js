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
   * @apiDescription Returns the only one documentType available. It brings the latest version of it.`
   * @apiName getDocumentType
   * @apiGroup DocumentType
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
   * @api {put} /document-types/:id Update
   * @apiDescription Updates a documentType. A new version is created and available for use.
   * @apiName putDocumentType
   * @apiGroup DocumentType
   *
   * @apiParam {Number} id The documentType id
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
