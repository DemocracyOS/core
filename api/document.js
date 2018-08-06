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
   * @api {get} /documents List
   * @apiName getDocuments
   * @apiDescription Returns a paginated list of -published- documents. Note that it wont list drafts if the request comes from a user with saved drafts.
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
   * @api {post} /documents Create
   * @apiName postDocument
   * @apiDescription Creates a document and returns the created document. The authorId is not required to be sent on the body. API sets the authorId by itself.
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
   * @api {get} /documents/:id Get
   * @apiName getDocument
   * @apiDescription Returns the data of a document.
   * @apiGroup Document
   * @apiParam {String} id Documents ID.
   * @apiSuccess {String}  id Id of the document
   * @apiSuccess {String}  authorId  The author keycloak id.
   * @apiSuccess {String}  published State of the document. If `false` is a draft and should not be public.
   * @apiSuccess {String}  documentType Id of the document type
   * @apiSuccess {Integer}  documentTypeVersion The current version of the document type. Starts with 0. If it is <code>0</code> then its the first version of the document type.
   * @apiSuccess {Date}  createdAt Date of creation
   * @apiSuccess {Date}  updatedAt Date of update
   * @apiSuccess {Object}  content Content of the document
   * @apiSuccess {String}  content.title Title of the document
   * @apiSuccess {String}  content.brief A brief of the document
   * @apiSuccess {Object}  content.fields The custom fields of the document, those were defined on the document type.
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
   * @api {put} /documents/:id Update
   * @apiName putDocument
   * @apiDescription Modifies a document. You just need to send the changed fields. No need to send all the document.
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
   * @api {delete} /documents/:id Delete
   * @apiName deleteDocument
   * @apiGroup Document
   * @apiDescription Deletes a document and returns the id of the removed document.
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
