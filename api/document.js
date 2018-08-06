const status = require('http-status')
const express = require('express')
const Document = require('../db-api/document')
const DocumentType = require('../db-api/documentType')
const DocumentTypeVersion = require('../db-api/documentTypeVersion')
const router = express.Router()
const auth = require('../services/auth')
const errors = require('../services/errors')
const log = require('../services/logger')
const middlewares = require('../services/middlewares')
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
        const results = await Document.list({ published: true }, {
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
    auth.keycloak.protect('realm:accountable'),
    async (req, res, next) => {
      try {
        const permissions = auth.getPermissions(req)
        // check if permissions
        const documentsCount = await Document.countAuthorDocuments(auth.getUserId(req))
        if (documentsCount >= permissions.documentLimit) {
          throw errors.ErrNotAuthorized('Cannot create more documents (Limit reached)')
        }
        req.body.authorId = auth.getUserId(req)
        const documentType = await DocumentType.get()
        const newDocument = await Document.create(req.body, documentType)
        res.status(status.CREATED).send(newDocument)
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
    middlewares.checkId,
    async (req, res, next) => {
      try {
        const document = await Document.get({ _id: req.params.id })
        // No document?
        if (!document) throw errors.ErrNotFound('Document not found or doesn\'t exist')
        // Check if it is published or not (draft)
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
    middlewares.checkId,
    auth.keycloak.protect('realm:accountable'),
    async (req, res, next) => {
      try {
        // Get the document
        const document = await Document.get({ _id: req.params.id })
        // Check if the user is the author of the document
        if (!(document.authorId === auth.getUserId(req))) {
          throw errors.ErrForbidden // User is not the author
        }
        // Retrieve the version of the documentType that the document follows
        const documentType = await DocumentTypeVersion.getVersion(document.documentTypeVersion)
        // Update the document, with the correct documentType
        const updatedDocumentType = await Document.update(req.params.id, req.body, documentType)
        res.status(status.OK).json(updatedDocumentType)
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
    middlewares.checkId,
    auth.keycloak.protect('realm:accountable'),
    async (req, res, next) => {
      try {
        // Check if the user is the author of the document.
        if (!Document.isAuthor(req.params.id, auth.getUserId(req))) {
          throw errors.ErrForbidden // User is not the author
        }
        // Remove document.
        await Document.remove(req.params.id)
        res.status(status.OK).json({ id: req.params.id })
      } catch (err) {
        next(err)
      }
    })

module.exports = router
