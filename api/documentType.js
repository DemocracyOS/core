const status = require('http-status')
const express = require('express')
const DocumentType = require('../db-api/documentType')
const DocumentTypeVersion = require('../db-api/documentTypeVersion')
const router = express.Router()
const auth = require('../services/auth')
const log = require('../services/logger')

router.route('/')
  /**
   * @api {get} /document-type Get
   * @apiDescription Returns the only one documentType available. It only brings the latest version of it.`
   * @apiName getDocumentType
   * @apiGroup DocumentType
   * @apiSuccess {String}  id Id of the document type
   * @apiSuccess {String}  name  The name of the document type.
   * @apiSuccess {String}  icon The icon of the document type, defined by Font Awesome. Ex: <code>fa-file-o</code>
   * @apiSuccess {String}  description Description of the document type
   * @apiSuccess {String}  createdAt The date of creation of the document type
   * @apiSuccess {Integer}  currentVersion The current version of the document type. Starts with 0. If it is <code>0</code> then its the first version of the document type.
   * @apiSuccess {Object}  field Defines the schema
   * @apiSuccess {[String]}  fields.required Defines which fields are required. Ex: <code>["authorName","authorSurname","authorEmail"]</code>
   * @apiSuccess {[Object]}  fields.blocks Defines blocks of fields. Ex: <code>[{"fields":["authorEmail","authorName","authorSurname"],"_id":"5b5be260f108924e9d87d538","name":"Authors contact info"]</code>
   * @apiSuccess {Object}  fields.properties Defines the properties of each field. <code>"{properties":{"authorName":{"type":"string","title":"Author's name"},"authorSurname":{"type":"string","title":"Author's surname"}}</code>
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
   * @api {put} /document-type Update
   * @apiDescription Updates a documentType, the response is the updated documentType.
   * 
   * A new version is triggered if <code>fields</code> is inside the PUT body.
   * The ignored paths <code>['name', 'icon', 'description', 'updatedAt']</code> don't trigger a new version.
   * You should only send the modified fields.
   *  @apiExample {json} Example body (keeps current version):
   *    {"name": "CV basic data v2", "icon": "fa-pencil"}
   * *  @apiExample {json} Example body (triggers new version):
   *    {"name": "CV basic data v2", "fields": {"required": ["authorName","authorEmail"]}}
   * @apiName putDocumentType
   * @apiGroup DocumentType
   * @apiPermission admin
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
