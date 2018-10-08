const status = require('http-status')
const express = require('express')
const { Types: { ObjectId } } = require('mongoose')
const Document = require('../db-api/document')
const Comment = require('../db-api/comment')
const CustomForm = require('../db-api/customForm')
const router = express.Router()
const auth = require('../services/auth')
const errors = require('../services/errors')
const middlewares = require('../services/middlewares')
const services = require('../services/utils')

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
   * @apiDescription Returns a paginated list of -published- documents
   * @apiGroup Document
   */
  .get(
    async (req, res, next) => {
      try {
        let results = null
        // If it is null, just show the published documents
        results = await Document.list({ published: true }, {
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

router.route('/my-documents')
  /**
     * @api {get} /my-documents List
     * @apiName getDocuments
     * @apiDescription Returns a paginated list of the users documents. Lists all kind of documents, no matter the state.
     * @apiGroup Document
     */
  .get(
    auth.keycloak.protect('realm:accountable'),
    async (req, res, next) => {
      try {
        let results = null
        // If it is null, just show the published documents
        results = await Document.list({ author: req.session.user._id }, {
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
        const isTheAuthor = req.session.user ? req.session.user._id.equals(document.author) : false
        // No document?
        if (!document) throw errors.ErrNotFound('Document not found or doesn\'t exist')
        // Check if it is published or not (draft)
        if (!document.published) {
          // It's a draft, check if the author is the user who requested it.
          if (!isTheAuthor) {
            // No, Then the user shouldn't be asking for this document.
            throw errors.ErrForbidden
          } 
        }
        // Deliver the document
        res.status(status.OK).json({
          document: document,
          isAuthor: isTheAuthor
        })
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
     * @api {get} /documents/:idDocument/comments Get an array of comments by IDs
     * @apiName getSomeComments
     * @apiGroup Comments
     * @apiDescription You can get an array of comments of a document, no matter the field,
     * you just need to specify in the querystring a key-value pair with key <code>ids</code> and an Stringified array of ids. Please, remember to user Array.prototype.join(',') the allowed format is <code>?ids=idExample1,idExample2,idExample3</code>.   
     */
  .get(
    async (req, res, next) => {
      try {
        if (!req.query.ids) {
          throw errors.ErrMissingParam('ids')
        }
        const idsToArray = req.query.ids.split(',')
        let idsArray = idsToArray.map((id) => {
          // console.log(ObjectId(id))
          return ObjectId(id)
          // return id
        })
        let query = {
          _id: { $in: idsArray },
          document: req.params.id
        }
        console.log(query)
        const results = await Comment.getAll(query)
        res.status(status.OK).json(results)
      } catch (err) {
        next(err)
      }
    })

router.route('/:id/comments/:idComment/resolve')
/**
     * @api {post} /documents/:idDocument/comments/:idComment/resolve Resolve a comment of a document
     * @apiName resolveComment
     * @apiGroup Comments
     * @apiDescription Resolves a comment of a document. This only sets the value <code>resolved</code> of a comment
     * 
     * The only one who can do this is the author of the document.
     *
     * @apiPermission accountable
     */
  .post(
    auth.keycloak.protect('realm:accountable'),
    async (req, res, next) => {
      try {
        const document = await Document.get({ _id: req.params.id })
        // Check if the user is the author of the document
        if (!req.session.user._id.equals(document.author)) {
          throw errors.ErrForbidden // User is not the author
        }
        // Update the comment
        const commentResolved = Comment.resolve({
          _id: req.params.idComment,
          document: req.params.id,
          resolved: false
        })
        res.status(status.OK).json(commentResolved)
      } catch (err) {
        next(err)
      }
    }
  )

router.route('/:id/:field')
  /**
     * @api {put} /documents/:idDocument/:field Updates the content a field of a document
     * @apiName updateDocumentField
     * @apiGroup Comments
     * @apiDescription Note: This is only intended when updating a state of a field after a comment was created and added to the text's state.
     *
     * The following should throw an error:
     *
     * - The <code>:field</code> is not part of the content of the document.
     * - The <code>:field</code> is not commentable.
     * - The text is being changed.
     * - More than one mark is being added to the state.
     * - The one and only mark (the modification) needs to be a comment.
     * 
     * Please note that any logged user can modify a field but knowing that this is for comments, the validators are used so you cannot mess around with this.
     * 
     * @apiPermission authenticated
     * @apiParam {string} content (Body) The state of the text editor
     */
  .put(
    middlewares.checkId,
    auth.keycloak.protect(),
    async (req, res, next) => {
      try {
        // Get the document
        const document = await Document.get({ _id: req.params.id })
        // Check if the field is part of the document
        if (!Object.keys(document.content.fields).indexOf(req.params.field)) {
          throw errors.ErrForbidden(req.params.field)
        }
        const customForm = await CustomForm.get({ _id: document.customForm })
        if (!customForm.fields.allowComments.indexOf(req.params.field)) {
          // If the field is not inside the "allowComments" array, throw an error
          throw errors.ErrForbidden(`The field ${req.params.field} is not commentable`)
        }
        // Create a new hash of the document, that will be used to check the text consistency
        let newHash = services.hashDocumentText(req.body.state)
        if (document.content.hashes[req.params.field] !== newHash) {
          // If the text of the field is being changed, throw an error
          throw errors.ErrForbidden(`The content of the field is being changed`)
        }
        // We need to check if the change is indeed a commentary
        // First we get an object with the Diff
        let fieldChanges = services.getJsonDiffs(document.content.field[req.params.field], req.body.content)
        // Now we get *ALL* the changes
        let theChanges = services.getObjects(fieldChanges, 'type', '')
        // There has to be only one change, and it should be the comments
        if (theChanges.length !== 1) {
          throw errors.ErrForbidden(`More than one mark has been added to the text`)
        }
        // And now, the only change allowed should be a mark of type "comment"
        if (theChanges[0].type !== 'comment') {
          throw errors.ErrForbidden(`You can only comment on a text.`)
        }
        // If everythig is ok...
        // Update the field
        const updatedDocument = await Document.updateField(req.params.id, req.params.field, req.body.content, newHash)
        res.status(status.OK).json(updatedDocument)
      } catch (err) {
        next(err)
      }
    })

router.route('/:id/:field/comments')
  /**
   * @api {get} /documents/:id/comments Get
   * @apiName getComments
   * @apiGroup Comments
   * @apiDescription Retrieves a paginated list of comments of a document
   */
  .get(
    middlewares.checkId,
    async (req, res, next) => {
      try {
        let query = {
          document: req.params.id,
          field: req.params.field
        }
        const results = await Comment.getAll(query)
        res.status(status.OK).json(results)
      } catch (err) {
        next(err)
      }
    }
  )
  /**
   * @api {post} /documents/:id/:field/comments Create
   * @apiName createComment
   * @apiGroup Comments
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
        req.body.user = req.session.user._id // Set the user
        req.body.document = req.params.id // Set the document
        const document = await Document.get({ _id: req.params.id })
        if (!document) {
          // Document not found
          throw errors.ErrNotFound('Document not found')
        }
        // Document Found
        // Get the customForm
        const customForm = await CustomForm.get({ _id: document.customForm })
        if (!customForm.fields.allowComments.find((x) => { return x === req.body.field })) {
          // If the field is not inside the "allowComments" array, throw error
          throw errors.ErrInvalidParam(`The field ${req.body.field} is not commentable`)
        }
        // Field is commentable
        // Save the comment
        const newComment = await Comment.create(req.body)
        // Return the comment with the ID
        res.status(status.CREATED).send(newComment)
      } catch (err) {
        next(err)
      }
    }
  )

module.exports = router
