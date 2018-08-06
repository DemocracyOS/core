const chai = require('chai')
const chaiHttp = require('chai-http')
const status = require('http-status')
const Document = require('../../models/document')
const DocumentType = require('../../models/documentType')
const DocumentTypeVersion = require('../../models/documentTypeVersion')
const config = require('../../config')
const fake = require('../fake')

const expect = chai.expect
chai.use(chaiHttp)

let fakeDocumentType = fake.documentType()
let fakeDocument1 = null
let fakeDocument2 = null
let fakeDocument3 = null

// Global variables for testing
let agent = null // user agent, simulates a browser.
let keycloakAgent = null // keycloak agent, simulates a browser.
let accessToken = null // bearer token provided by Keycloak

let newDocumentType = null
let newDocument1 = null
let newDocument2 = null
let newDocument3 = null
let newDocument4 = null

describe('Documents API (/api/v1/documents)', () => {
  before(async () => {
    await require('../../server')
    // Before starting the tests, make sure to prepare the enviroment
    // That is, clean the database, or initialize anything you need before executing the suite of tests
    await DocumentType.remove({})
    await DocumentTypeVersion.remove({})
    await Document.remove({})
    newDocumentType = await (new DocumentType(fakeDocumentType)).save()
    fakeDocument1 = fake.document(true, true, null, newDocumentType.id)
    fakeDocument2 = fake.document(true, false, null, newDocumentType.id)
    fakeDocument3 = fake.document(true, true, null, newDocumentType.id)
    newDocument1 = await (new Document(fakeDocument1)).save()
    newDocument2 = await (new Document(fakeDocument2)).save()
    newDocument3 = await (new Document(fakeDocument3)).save()
  })

  describe('As anonymous user', () => {
    before(async () => {
      // Create the agent
      agent = await chai.request.agent(config.ROOT_URL)
    })
    it('GET (/) Anyone should be able to get a list of PUBLISHED documents', async () => {
      await agent.get('/api/v1/documents')
        .then((res) => {
          expect(res).to.have.status(status.OK)
          const { results, pagination } = res.body
          expect(results).to.be.a('array')
          expect(results.length).to.be.eql(2)
          expect(results[0]).to.have.property('authorId')
          expect(results[0]).to.have.property('published')
          expect(results[0]).to.have.property('publishedAt')
          expect(results[0]).to.have.property('documentType')
          expect(results[0]).to.have.property('documentTypeVersion')
          expect(results[0].content).to.be.an('object')
          expect(results[0].content).to.have.property('title')
          expect(results[0].content).to.have.property('brief')
          expect(results[0].content).to.have.property('fields')
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
  describe('As an "Accountable" user (Group member: Accountable - Role: accountable)', () => {
    before(async () => {
      // Create the agent
      agent = await chai.request.agent(config.ROOT_URL)
      keycloakAgent = await chai.request.agent(config.KEYCLOAK_CONFIG['auth-server-url'])
    })
    it('should get access_token from auth provider', async () => {
      let userCredentials = {}
      Object.assign(userCredentials, config.CREDENTIALS_ADMIN_TEST)
      userCredentials.username = 'user'
      await keycloakAgent.post('/realms/democracyos-test/protocol/openid-connect/token')
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(userCredentials)
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
    it('POST (/) it should be able to create a document', async () => {
      let newDocument = fake.document(true, false, null, newDocumentType.id)
      await agent.post(`/api/v1/documents`)
        .set('Authorization', 'Bearer ' + accessToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/json')
        .send(newDocument)
        .then((res) => {
          expect(res).to.have.status(status.CREATED)
          /* eslint-disable no-unused-expressions */
          newDocument4 = res.body
        })
        .catch((err) => {
          throw err
        })
    })
    it('GET (/:id) it should be to retrieve a document', async () => {
      await agent.get(`/api/v1/documents/${newDocument4._id}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/json')
        .then((res) => {
          expect(res).to.have.status(status.OK)
          /* eslint-disable no-unused-expressions */
          expect(res.body).to.have.property('authorId')
          expect(res.body).to.have.property('published')
          expect(res.body).to.have.property('publishedAt')
          expect(res.body).to.have.property('documentType')
          expect(res.body).to.have.property('documentTypeVersion')
          expect(res.body.content).to.be.an('object')
          expect(res.body.content).to.have.property('title')
          expect(res.body.content).to.have.property('brief')
          expect(res.body.content).to.have.property('fields')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          throw err
        })
    })
    it('PUT (/:id) it should be to update a document (Ex: publishing the document)', async () => {
      let modification = { published: true }
      await agent.put(`/api/v1/documents/${newDocument4._id}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/json')
        .send(modification)
        .then((res) => {
          expect(res).to.have.status(status.OK)
          /* eslint-disable no-unused-expressions */
          expect(res.body).to.have.property('authorId')
          expect(res.body).to.have.property('published')
          expect(res.body.published).to.be.equal(true)
          expect(res.body).to.have.property('publishedAt')
          expect(res.body).to.have.property('documentType')
          expect(res.body).to.have.property('documentTypeVersion')
          expect(res.body.content).to.be.an('object')
          expect(res.body.content).to.have.property('title')
          expect(res.body.content).to.have.property('brief')
          expect(res.body.content).to.have.property('fields')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          throw err
        })
    })
    it('DELETE (/:id) it should be to delete a document', async () => {
      await agent.delete(`/api/v1/documents/${newDocument4._id}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/json')
        .then((res) => {
          expect(res).to.have.status(status.OK)
          expect(res.body).to.have.property('id')
          expect(res.body.id).to.be.equal(newDocument4._id)
        })
        .catch((err) => {
          throw err
        })
    })
  })
  //   it('POST (/) it should be able to update document type', async () => {
  //   // let newDocumentType = fakeDocumentType
  //   let anotherFakeDocumentType = fake.documentType()
  //   await agent.put(`/api/v1/documents`)
  //     .set('Authorization', 'Bearer ' + accessToken)
  //     .set('X-Requested-With', 'XMLHttpRequest')
  //     .set('Content-Type', 'application/json')
  //     .send(anotherFakeDocumentType)
  //     .then((res) => {
  //       expect(res).to.have.status(status.OK)
  //       /* eslint-disable no-unused-expressions */
  //       expect(res.body).to.not.be.null
  //       expect(res.body).to.have.property('name')
  //       expect(res.body).to.have.property('icon')
  //       expect(res.body).to.have.property('description')
  //       expect(res.body).to.have.property('fields')
  //       expect(res.body.fields.properties).to.be.deep.equal(anotherFakeDocumentType.fields.properties)
  //       expect(res.body).to.have.property('createdAt')
  //       expect(res.body).to.have.property('updatedAt')
  //       expect(res.body).to.have.property('currentVersion')
  //       expect(res.body.currentVersion).to.be.equal(1)
  //     })
  //     .catch((err) => {
  //       throw err
  //     })
  // })
  //   it('PUT (/) it should be able to update document type', async () => {
  //     // let newDocumentType = fakeDocumentType
  //     let anotherFakeDocumentType = fake.documentType()
  //     await agent.put(`/api/v1/documents`)
  //       .set('Authorization', 'Bearer ' + accessToken)
  //       .set('X-Requested-With', 'XMLHttpRequest')
  //       .set('Content-Type', 'application/json')
  //       .send(anotherFakeDocumentType)
  //       .then((res) => {
  //         expect(res).to.have.status(status.OK)
  //         /* eslint-disable no-unused-expressions */
  //         expect(res.body).to.not.be.null
  //         expect(res.body).to.have.property('name')
  //         expect(res.body).to.have.property('icon')
  //         expect(res.body).to.have.property('description')
  //         expect(res.body).to.have.property('fields')
  //         expect(res.body.fields.properties).to.be.deep.equal(anotherFakeDocumentType.fields.properties)
  //         expect(res.body).to.have.property('createdAt')
  //         expect(res.body).to.have.property('updatedAt')
  //         expect(res.body).to.have.property('currentVersion')
  //         expect(res.body.currentVersion).to.be.equal(1)
  //       })
  //       .catch((err) => {
  //         throw err
  //       })
  //   })
  // })
})
