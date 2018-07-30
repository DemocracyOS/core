const chai = require('chai')
const chaiHttp = require('chai-http')
const status = require('http-status')
const DocumentType = require('../../models/documentType')
const DocumentTypeVersion = require('../../models/documentTypeVersion')
const config = require('../../config')
const fake = require('../fake')

const expect = chai.expect
chai.use(chaiHttp)

let fakeDocumentType1 = fake.documentType()
let fakeDocumentType2 = fake.documentType()
let fakeDocumentType3 = fake.documentType()
let newDocumentType1 = null
// Global variables for testing
let agent = null // user agent, simulates a browser.
let keycloakAgent = null // keycloak agent, simulates a browser.
let accessToken = null // bearer token provided by Keycloak

describe('DocumentType API (/api/v1/document-type)', () => {
  before(async () => {
    await require('../../server')
    // Before starting the tests, make sure to prepare the enviroment
    // That is, clean the database, or initialize anything you need before executing the suite of tests
    await DocumentType.remove({})
    await DocumentTypeVersion.remove({})
    newDocumentType_1 = await (new DocumentType(fakeDocumentType1)).save()
    await (new DocumentType(fakeDocumentType2)).save()
    await (new DocumentType(fakeDocumentType3)).save()
  })

  describe('As anonymous user', () => {
    before(async () => {
      // Create the agent
      agent = await chai.request.agent(config.ROOT_URL)
    })
    it('GET (/) Anyone should be able to get documentType', async () => {
      await agent.get('/api/v1/document-type')
        .then((res) => {
          expect(res).to.have.status(status.OK)
          /* eslint-disable no-unused-expressions */
          expect(res.body).to.not.be.null
          expect(res.body).to.have.property('name')
          expect(res.body).to.have.property('icon')
          expect(res.body).to.have.property('description')
          expect(res.body).to.have.property('fields')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
          expect(res.body).to.have.property('currentVersion')
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
    it('PUT (/) it should be able to update document type', async () => {
      // let newDocumentType = fakeDocumentType
      let anotherFakeDocumentType = fake.documentType()
      await agent.put(`/api/v1/document-type`)
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
          expect(res.body).to.have.property('fields')
          expect(res.body.fields.properties).to.be.deep.equal(anotherFakeDocumentType.fields.properties)
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
          expect(res.body).to.have.property('currentVersion')
          expect(res.body.currentVersion).to.be.equal(1)
        })
        .catch((err) => {
          throw err
        })
    })
  })
})
