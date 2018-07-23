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
        const results = await DocumentType.list({
          limit: req.query.limit,
          page: req.query.page,
          versions: req.query.versions
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
   * @api {post} /document-types Create
   * @apiDescription Creates a new documentType
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
   * @api {get} /document-types/:id Get
   * @apiDescription Get the lastest version of a documentType
   * @apiName getDocumentType
   * @apiGroup DocumentType
   *
   * @apiParam {Number} id The documentType id
   */
  .get(
    async (req, res, next) => {
      try {
        const documentType = await DocumentType.get(req.params.id, false)
        res.status(status.OK).json(documentType)
      } catch (err) {
        next(err)
      }
    })
  /**
   * @api {put} /document-types/:id Update
   * @apiDescription Updates a documentType. A new version gets created and available for use.
   * @apiName putDocumentType
   * @apiGroup DocumentType
   *
   * @apiParam {Number} id The documentType id
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
   * @api {delete} /document-types/:id Delete
   * @apiDescription Deletes a documentType. It's a soft delete. The versions will still be available.
   * @apiName deleteDocumentType
   * @apiGroup DocumentType
   *
   * @apiParam {Number} id The documentType id
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

router.route('/:id/versions')
  /**
   * @api {get} /document-types/:id/versions Get versions
   * @apiDescription Gets a document type, with all its versions available in `versions` param
   * @apiName getVersions
   * @apiGroup DocumentType
   *
   * @apiParam {Number} id The documentType id
   */
  .get(
    async (req, res, next) => {
      try {
        const documentType = await DocumentType.get(req.params.id, true)
        res.status(status.OK).json(documentType)
      } catch (err) {
        next(err)
      }
    })

router.route('/:id/versions/:v')
  /**
   * @api {get} /document-types/:id/versions/:v Get version
   * @apiDescription Gets a specific version of a documentType
   * @apiName getVersion
   * @apiGroup DocumentType
   *
   * @apiParam {Number} id The documentType id
   * @apiParam {Number} v The documentType version
   */
  .get(
    async (req, res, next) => {
      try {
        const documentTypeVersion = await DocumentTypeVersion.getVersion(req.params.id, req.params.v)
        res.status(status.OK).json(documentTypeVersion)
      } catch (err) {
        next(err)
      }
    })

module.exports = router
