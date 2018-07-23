const chai = require('chai')
const chaiHttp = require('chai-http')
const status = require('http-status')
const DocumentType = require('../../models/documentType')
const DocumentTypeVersion = require('../../models/documentTypeVersion')
const config = require('../../config')
const fake = require('../fake')

const expect = chai.expect
chai.use(chaiHttp)

let fakeDocumentType_1 = fake.documentType()
let fakeDocumentType_2 = fake.documentType()
let fakeDocumentType_3 = fake.documentType()
let newDocumentType_1 = null
// Global variables for testing
let agent = null // user agent, simulates a browser.
let keycloakAgent = null // keycloak agent, simulates a browser.
let accessToken = null // bearer token provided by Keycloak

describe('DocumentType API (/api/v1/documentType)', () => {
  before(async () => {
    await require('../../server')
    // Before starting the tests, make sure to prepare the enviroment
    // That is, clean the database, or initialize anything you need before executing the suite of tests
    await DocumentType.remove({})
    await DocumentTypeVersion.remove({})
    newDocumentType_1 = await (new DocumentType(fakeDocumentType_1)).save()
    await (new DocumentType(fakeDocumentType_2)).save()
    await (new DocumentType(fakeDocumentType_3)).save()
  })

  describe('As anonymous user', () => {
    before(async () => {
      // Create the agent
      agent = await chai.request.agent(config.ROOT_URL)
    })
    it('GET (/) Anyone should be able to get a list of documentTypes', async () => {
      await agent.get('/api/v1/document-types')
        .then((res) => {
          expect(res).to.have.status(status.OK)
          /* eslint-disable no-unused-expressions */
          const { results, pagination } = res.body
          expect(results).to.be.a('array')
          expect(results.length).to.be.eql(3)
          results.every((dt) => expect(dt).to.have.any.keys('name', 'icon', 'description', 'versions', 'fields', 'createdAt', 'updatedAt'))
          results.every((dt) => expect(dt.versions).to.be.null)
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
    it('PUT (/) it should be able to update a specific document type', async () => {
      // let newDocumentType = fakeDocumentType
      let anotherFakeDocumentType = fake.documentType()
      await agent.put(`/api/v1/document-types/${newDocumentType_1.id}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/json')
        .send(anotherFakeDocumentType)
        .then((res) => {
          expect(res).to.have.status(status.OK)
          /* eslint-disable no-unused-expressions */
          expect(res.body).to.not.be.null
          expect(res.body).to.have.property('name')
          expect(res.body).to.have.property('icon')
          expect(res.body).to.have.property('description')
          expect(res.body).to.have.property('versions')
          expect(res.body).to.have.property('fields')
          expect(res.body.fields.properties).to.be.deep.equal(anotherFakeDocumentType.fields.properties)
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
          expect(res.body).to.have.property('__v')
          expect(res.body.__v).to.be.equal(1) // version 2
        })
        .catch((err) => {
          throw err
        })
    })
  })
})
