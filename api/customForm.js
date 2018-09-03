const status = require('http-status')
const express = require('express')
const CustomForm = require('../db-api/customForm')
const router = express.Router()
const auth = require('../services/auth')
const middlewares = require('../services/middlewares')
const log = require('../services/logger')

router.route('/')
  /**
   * @api {get} /custom-form List
   * @apiDescription Returns a list of available custom forms. Only brings the latests versions of the custom forms.
   * @apiName getCustomForms
   * @apiGroup CustomForm
   * @apiParam {boolean} versions Query parameter. Optional. Retrieves all the versions of all the available document Types if `true`
   */
  .get(
    async (req, res, next) => {
      try {
        const results = await CustomForm.list({}, {
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
   * @api {post} /custom-form Create
   * @apiDescription Creates a new customForm
   * @apiName postCustomForm
   * @apiGroup CustomForm
   */
  .post(
    auth.keycloak.protect('realm:admin'),
    async (req, res, next) => {
      try {
        const dataCustomForm = {
          name: req.body.name,
          icon: req.body.icon,
          description: req.body.description,
          fields: req.body.fields
        }
        const newCustomForm = await CustomForm.create(dataCustomForm)
        res.status(status.CREATED).json(newCustomForm)
      } catch (err) {
        next(err)
      }
    })

router.route('/:id')
  /**
   * @api {get} /custom-Form/:id Get
   * @apiDescription Get the lastest version of a customForm
   * @apiName getCustomForm
   * @apiGroup CustomForm
   *
   * @apiParam {Number} id The customForm id
   */
  .get(
    middlewares.checkId,
    async (req, res, next) => {
      try {
        const customForm = await CustomForm.get({ _id: req.params.id })
        res.status(status.OK).json(customForm)
      } catch (err) {
        next(err)
      }
    })
  /**
   * @api {put} /custom-form/:id Update
   * @apiDescription Updates a customForm. A new version gets created and available for use.
   * @apiName putCustomForm
   * @apiGroup CustomForm
   *
   * @apiParam {Number} id The customForm id
   */
  .put(
    middlewares.checkId,
    auth.keycloak.protect('realm:admin'),
    async (req, res, next) => {
      try {
        const updatedCustomForm = await CustomForm.update(req.params.id, req.body)
        res.status(status.OK).json(updatedCustomForm)
      } catch (err) {
        next(err)
      }
    })
  /**
   * @api {delete} /custom-form/:id Delete
   * @apiDescription Deletes a customForm. It's a soft delete. The versions will still be available.
   * @apiName deleteCustomForm
   * @apiGroup CustomForm
   *
   * @apiParam {Number} id The customForm id
   */
  .delete(
    middlewares.checkId,
    auth.keycloak.protect('realm:admin'),
    async (req, res, next) => {
      try {
        // TODO
        // Shouldn't delete a custom form if there is a document already using it
        // res.status(status.OK).json({ id: req.params.id })
      } catch (err) {
        next(err)
      }
    })

module.exports = router
