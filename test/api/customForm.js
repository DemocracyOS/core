const chai = require('chai')
const chaiHttp = require('chai-http')
const status = require('http-status')
const CustomForm = require('../../models/customForm')
const config = require('../../config')
const fake = require('../fake')

const expect = chai.expect
chai.use(chaiHttp)

let fakeCustomForm = fake.customForm()
let newCustomForm = null
// Global variables for testing
let agent = null // user agent, simulates a browser.
let keycloakAgent = null // keycloak agent, simulates a browser.
let accessToken = null // bearer token provided by Keycloak

describe('CustomForm API (/api/v1/custom-forms)', () => {
  before(async () => {
    await require('../../server')
    // Before starting the tests, make sure to prepare the enviroment
    // That is, clean the database, or initialize anything you need before executing the suite of tests
    await CustomForm.remove({})
    newCustomForm = await (new CustomForm(fakeCustomForm)).save()
  })

  describe('As anonymous user', () => {
    before(async () => {
      // Create the agent
      agent = await chai.request.agent(config.ROOT_URL)
    })
    // ===================================================
    it('GET (/) Anyone should be able to get customForm', async () => {
      await agent.get('/api/v1/custom-forms')
        .then((res) => {
          expect(res).to.have.status(status.OK)
          /* eslint-disable no-unused-expressions */
          expect(res).to.have.status(status.OK)
          const { results, pagination } = res.body
          expect(results).to.be.a('array')
          expect(results.length).to.be.least(1)
          expect(results[0]).to.have.property('name')
          expect(results[0]).to.have.property('icon')
          expect(results[0]).to.have.property('description')
          expect(results[0]).to.have.property('version')
          expect(results[0]).to.have.property('fields')
          expect(results[0]).to.have.property('createdAt')
          expect(results[0]).to.have.property('updatedAt')
          expect(pagination).to.have.property('count')
          expect(pagination).to.have.property('page')
          expect(pagination).to.have.property('limit')
        })
        .catch((err) => {
          // expect(err).to.have.status(status.FORBIDDEN)
          throw err
        })
    })
  })
  describe('As an admin user', () => {
    before(async () => {
      // Create the agent
      agent = await chai.request.agent(config.ROOT_URL)
      keycloakAgent = await chai.request.agent(config.KEYCLOAK_CONFIG['auth-server-url'])
    })
    // ===================================================
    it('should get access_token from auth provider', async () => {
      await keycloakAgent.post('/realms/democracyos-test/protocol/openid-connect/token')
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(config.CREDENTIALS_ADMIN_TEST)
        .then((res) => {
          accessToken = res.body.access_token
          expect(res).to.have.status(status.OK)
          /* eslint-disable no-unused-expressions */
          expect(res.body).to.not.be.null
          expect(res.body).to.have.property('access_token')
          expect(res.body).to.be.a('object')
        })
        .catch((err) => {
          throw err
        })
    })
    // ===================================================
    it('POST (/) it should be able to create a new customForm', async () => {
      // let newCustomForm = fakeCustomForm
      let anotherFakeCustomForm = fake.customForm()
      await agent.post(`/api/v1/custom-forms`)
        .set('Authorization', 'Bearer ' + accessToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/json')
        .send(anotherFakeCustomForm)
        .then((res) => {
          expect(res).to.have.status(status.CREATED)
          /* eslint-disable no-unused-expressions */
          expect(res.body).to.not.be.null
          expect(res.body).to.have.property('name')
          expect(res.body).to.have.property('icon')
          expect(res.body).to.have.property('description')
          expect(res.body).to.have.property('fields')
          expect(res.body.fields.properties).to.be.deep.equal(anotherFakeCustomForm.fields.properties)
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
          expect(res.body).to.have.property('version')
          expect(res.body.version).to.be.equal(0)
        })
        .catch((err) => {
          throw err
        })
    })
    // ===================================================
    it('PUT (/) it should be able to update document type', async () => {
      // let newCustomForm = fakeCustomForm
      let anotherFakeCustomForm = fake.customForm()
      await agent.put(`/api/v1/custom-forms/${newCustomForm.id}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/json')
        .send(anotherFakeCustomForm)
        .then((res) => {
          expect(res).to.have.status(status.OK)
          /* eslint-disable no-unused-expressions */
          expect(res.body).to.not.be.null
          expect(res.body).to.have.property('name')
          expect(res.body).to.have.property('icon')
          expect(res.body).to.have.property('description')
          expect(res.body).to.have.property('fields')
          expect(res.body.fields.properties).to.be.deep.equal(anotherFakeCustomForm.fields.properties)
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
          expect(res.body).to.have.property('version')
          expect(res.body.version).to.be.equal(1)
        })
        .catch((err) => {
          throw err
        })
    })
  })
})
