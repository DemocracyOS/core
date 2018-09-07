const status = require('http-status')
const express = require('express')
const Document = require('../db-api/document')
const GeneralComment = require('../db-api/generalComment')
const CustomForm = require('../db-api/customForm')
const router = express.Router()
const auth = require('../services/auth')
const errors = require('../services/errors')
const middlewares = require('../services/middlewares')

/**
 * @apiDefine admin User access only
 * User must be an admin (Keycloak)
 */

/**
 * @apiDefine accountable Accountable members only
 * User must be a member of the Accountable group (Keycloak)
 */

/**
 * @apiDefine authenticated Must be authenticated
 * User must be authenticated before accessing (Keycloak)
 */

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
        let results = null
        // If it is null, just show the published documents
        if (req.query.myDocs !== undefined && auth.hasRealmRole(req, 'accountable')) {
          results = await Document.list({ author: req.session.user._id }, {
            limit: req.query.limit,
            page: req.query.page
          })
        } else {
          results = await Document.list({ published: true }, {
            limit: req.query.limit,
            page: req.query.page
          })
        }
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
   * @apiDescription Creates a document and returns the created document. The author is not required to be sent on the body. API sets the author by itself.
   * @apiGroup Document
   * @apiPermission accountable
   */
  .post(
    auth.keycloak.protect('realm:accountable'),
    async (req, res, next) => {
      try {
        const permissions = auth.getPermissions(req)
        // check if permissions
        const documentsCount = await Document.countAuthorDocuments(req.session.user._id)
        if (documentsCount >= permissions.documentLimit) {
          throw errors.ErrNotAuthorized('Cannot create more documents (Limit reached)')
        }
        req.body.author = req.session.user._id
        const customForm = await CustomForm.get({ _id: req.body.customForm })
        const newDocument = await Document.create(req.body, customForm)
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
   * @apiSuccess {String}  author  The user id of the author.
   * @apiSuccess {String}  published State of the document. If `false` is a draft and should not be public.
   * @apiSuccess {String}  customForm Id of the custom form
   * @apiSuccess {Date}  createdAt Date of creation
   * @apiSuccess {Date}  updatedAt Date of update
   * @apiSuccess {Object}  content Content of the document
   * @apiSuccess {String}  content.title Title of the document
   * @apiSuccess {String}  content.brief A brief of the document
   * @apiSuccess {Object}  content.fields The custom fields of the document, those were defined on the custom form.
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
          if (req.session.user._id.equals(document.author)) {
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
   * @apiPermission accountable
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
        if (!req.session.user._id.equals(document.author)) {
          throw errors.ErrForbidden // User is not the author
        }
        // Retrieve the version of the customForm that the document follows
        const customForm = await CustomForm.get({ _id: document.customForm })
        // Update the document, with the correct customForm
        const updatedCustomForm = await Document.update(req.params.id, req.body, customForm)
        res.status(status.OK).json(updatedCustomForm)
      } catch (err) {
        next(err)
      }
    })
  /**
   * @api {delete} /documents/:id Delete
   * @apiName deleteDocument
   * @apiGroup Document
   * @apiPermission accountable
   * @apiDescription Deletes a document and returns the id of the removed document.
   */
  .delete(
    middlewares.checkId,
    auth.keycloak.protect('realm:accountable'),
    async (req, res, next) => {
      try {
        // Check if the user is the author of the document.
        if (!Document.isAuthor(req.params.id, req.session.user._id)) {
          throw errors.ErrForbidden // User is not the author
        }
        // Remove document.
        await Document.remove(req.params.id)
        res.status(status.OK).json({ id: req.params.id })
      } catch (err) {
        next(err)
      }
    })

router.route('/:id/comments')
  /**
   * @api {get} /documents/:id/comments Get
   * @apiName getGeneralComments
   * @apiGroup GeneralComments
   * @apiDescription Retrieves a paginated list of comments of a document
   */
  .get(
    middlewares.checkId,
    async (req, res, next) => {
      try {
        let query = {
          document: req.params.id
        }
        if (req.body.field) query.field = req.body.field
        const results = await Document.listGeneralComments(query, {
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
    }
  )
  /**
   * @api {post} /documents/:id/comments Create
   * @apiName createComment
   * @apiGroup GeneralComments
   * @apiDescription Creates a comment on a specific field of a document.
   * @apiPermission authenticated
   * @apiParam {string} field (Body) The field of the document where the comment is being made
   * @apiParam {Number} comment (Body) The field of the document where the comment is being made
   * @apiExample {json} POST body
   * {
   *  "field": "authorName",
   *  "comment": "Nullam sit amet ipsum id metus porta rutrum in vel nibh. Sed efficitur quam urna, eget imperdiet libero ornare."
   * }
   */
  .post(
    middlewares.checkId,
    auth.keycloak.protect(),
    async (req, res, next) => {
      try {
        req.body.user = req.session.user._id
        req.body.document = req.params.id
        const document = await Document.get({ _id: req.params.id })
        const customForm = await CustomForm.get({ _id: document.customForm })
        if (!customForm.fields.allowComments.find((x) => { return x === req.body.field })) {
          throw errors.ErrInvalidParam(`The field ${req.body.field} is not commentable`)
        }
        const newGeneralComment = await GeneralComment.create(req.body)
        res.status(status.CREATED).send(newGeneralComment)
      } catch (err) {
        next(err)
      }
    }
  )

module.exports = router
