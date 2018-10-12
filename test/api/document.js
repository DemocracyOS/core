const chai = require('chai')
const chaiHttp = require('chai-http')
const status = require('http-status')
const Document = require('../../models/document')
const CustomForm = require('../../models/customForm')
const Comment = require('../../models/comment')
const Like = require('../../models/like')
const config = require('../../config')
const fake = require('../fake')

const expect = chai.expect
chai.use(chaiHttp)

let fakeCustomForm = fake.customForm()
let fakeDocument1 = null
let fakeDocument2 = null
let fakeDocument3 = null
let fakeLike = null

// Global variables for testing
let agent = null // user agent, simulates a browser.
let keycloakAgent = null // keycloak agent, simulates a browser.
let accessToken = null // bearer token provided by Keycloak

let newCustomForm = null
let newDocument1 = null
let newDocument2 = null
let newDocument3 = null
let newDocument4 = null
let newLike = null

describe('Documents API (/api/v1/documents)', () => {
  before(async () => {
    await require('../../server')
    // Before starting the tests, make sure to prepare the enviroment
    // That is, clean the database, or initialize anything you need before executing the suite of tests
    await CustomForm.remove({})
    await Document.remove({})
    await Comment.remove({})
    await Like.remove({})
    newCustomForm = await (new CustomForm(fakeCustomForm)).save()
    fakeDocument1 = fake.document(true, true, null, newCustomForm.id)
    fakeDocument2 = fake.document(true, false, null, newCustomForm.id)
    fakeDocument3 = fake.document(true, true, null, newCustomForm.id)
    fakeLike = fake.like()
    newDocument1 = await (new Document(fakeDocument1)).save()
    newDocument2 = await (new Document(fakeDocument2)).save()
    newDocument3 = await (new Document(fakeDocument3)).save()
    newLike = await (new Like(fakeLike)).save()
  })

  describe('As anonymous user', () => {
    before(async () => {
      // Create the agent
      agent = await chai.request.agent(config.ROOT_URL)
    })
    it('POST (/:id/comments/:idComment/like) should be able to like a comment', async () => {
      const fakeLikeData = fake.like()
      await agent.post(`/api/v1/documents/1234/comments/${fakeLikeData.comment}/like`)
        .set('Content-Type', 'application/json')
        .send({})
        .then((res) => {
          expect(res).to.have.status(status.OK)
        })
    })
    it('GET (/) should not be able to list documents', async () => {
      await agent.get('/api/v1/documents')
        .set('Authorization', 'Bearer ' + accessToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/json')
        .then((res) => {
          // Nothing
        })
        .catch((err) => {
          expect(err).to.have.status(status.FORBIDDEN)
        })
    })
    it('POST (/) should not be able to create a document', async () => {
      let newDocument = fake.document(true, false, null, newCustomForm.id)
      await agent.post(`/api/v1/documents`)
        .set('Content-Type', 'application/json')
        .send(newDocument)
        .then((res) => {
          // Nothing
        })
        .catch((err) => {
          expect(err).to.have.status(status.FORBIDDEN)
        })
    })
    it('GET (/:id) An anonymous user should not be able to get a unpublished document', async () => {
      await agent.get(`/api/v1/documents/${newDocument2._id}`)
        .then((res) => {
          // Nothing
        })
        .catch((err) => {
          expect(err).to.have.status(status.FORBIDDEN)
        })
    })
    it('GET (/:id) An anonymous user should able to get a published document', async () => {
      await agent.get(`/api/v1/documents/${newDocument1._id}`)
        .then((res) => {
          expect(res).to.have.status(status.OK)
          expect(res.body).to.have.property('author')
          expect(res.body).to.have.property('published')
          expect(res.body.published).to.be.equal(true)
          expect(res.body).to.have.property('customForm')
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
  })
  // ===================================================
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
          expect(res.body).to.not.be.equal(null)
          expect(res.body).to.have.property('access_token')
          expect(res.body).to.be.a('object')
        })
        .catch((err) => {
          throw err
        })
    })    
    it('POST (/) it should be able to create a document', async () => {
      let newDocument = fake.document(true, false, null, newCustomForm.id)
      await agent.post(`/api/v1/documents`)
        .set('Authorization', 'Bearer ' + accessToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/json')
        .send(newDocument)
        .then((res) => {
          expect(res).to.have.status(status.CREATED)
          newDocument4 = res.body
        })
        .catch((err) => {
          throw err
        })
    })
    it('POST (/) should fail because the permission -documentLimit- is set (Test is limited to 10 tries)', async () => {
      let newDocument = fake.document(true, true, null, newCustomForm.id)
      let keepCreating = true
      let documentsCreated = 0
      do {
        await agent.post(`/api/v1/documents`)
          .set('Authorization', 'Bearer ' + accessToken)
          .set('X-Requested-With', 'XMLHttpRequest')
          .set('Content-Type', 'application/json')
          .send(newDocument)
          .then((res) => {
            if (res.status === status.FORBIDDEN) {
              keepCreating = false
              expect(res).to.have.status(status.FORBIDDEN)
            }
            documentsCreated++
            // Do nothing.. keep creating
          })
          .catch((err) => {
            throw err
          })
      } while (keepCreating && documentsCreated <= 10)
      expect(documentsCreated).to.be.most(10)
    })
    it('GET (/) The author should be able to list its own documents, drafts or published', async () => {
      await agent.get('/api/v1/documents?myDocs')
        .set('Authorization', 'Bearer ' + accessToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/json')
        .then((res) => {
          expect(res).to.have.status(status.OK)
          const { results, pagination } = res.body
          expect(results).to.be.a('array')
          expect(results.length).to.be.least(1)
          expect(results[0]).to.have.property('author')
          expect(results[0]).to.have.property('published')
          expect(results[0]).to.have.property('customForm')
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
    it('POST (/:id/comments) should be able to create a comment on a specific document, of a specific field', async () => {
      let fakeComment = fake.comment()
      await agent.post(`/api/v1/documents/${newDocument1._id}/comments`)
        .set('Authorization', 'Bearer ' + accessToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/json')
        .send(fakeComment)
        .then((res) => {
          expect(res).to.have.status(status.CREATED)
          /* eslint-disable no-unused-expressions */
          expect(res.body).to.not.be.null
          expect(res.body).to.have.property('document')
          expect(res.body).to.have.property('user')
          expect(res.body).to.have.property('field')
          expect(res.body).to.have.property('comment')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          // expect(err).to.have.status(status.FORBIDDEN)
          throw err
        })
    })
    it('GET (/:id/comments) should be able to get a list of comments of a specific document', async () => {
      await agent.get(`/api/v1/documents/${newDocument1._id}/comments`)
        .set('Authorization', 'Bearer ' + accessToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/json')
        .then((res) => {
          expect(res).to.have.status(status.OK)
          const { results, pagination } = res.body
          expect(results).to.be.a('array')
          expect(results.length).to.be.least(1)
          expect(results[0]).to.have.property('document')
          expect(results[0]).to.have.property('user')
          expect(results[0]).to.have.property('field')
          expect(results[0]).to.have.property('comment')
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
    it('GET (/:id) it should be to retrieve a document', async () => {
      // console.log(`/api/v1/documents/${newDocument4._id}`)
      await agent.get(`/api/v1/documents/${newDocument3._id}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/json')
        .then((res) => {
          expect(res).to.have.status(status.OK)
          expect(res.body).to.have.property('author')
          expect(res.body).to.have.property('published')
          expect(res.body).to.have.property('customForm')
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
          expect(res.body).to.have.property('author')
          expect(res.body).to.have.property('published')
          expect(res.body.published).to.be.equal(true)
          expect(res.body).to.have.property('customForm')
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
})
