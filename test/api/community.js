const chai = require('chai')
const chaiHttp = require('chai-http')
const status = require('http-status')
const Community = require('../../models/community')
const config = require('../../config')
const fake = require('../fake')

const expect = chai.expect
chai.use(chaiHttp)

let fakeCommunity = fake.community()
let newCommunity = null
// Global variables for testing
let agent = null // user agent, simulates a browser.
let keycloakAgent = null // keycloak agent, simulates a browser.
let accessToken = null // bearer token provided by Keycloak

describe('Community API (/api/v1/community)', () => {
  before(async () => {
    await require('../../server')
    // Before starting the tests, make sure to prepare the enviroment
    // That is, clean the database, or initialize anything you need before executing the suite of tests
    await Community.remove({})
    newCommunity = await (new Community(fakeCommunity)).save()
  })

  describe('As anonymous user', () => {
    before(async () => {
      // Create the agent
      agent = await chai.request.agent(config.ROOT_URL)
    })
    it('GET (/) Anyone should be able to get the community data', async () => {
      await agent.get('/api/v1/community')
        .then((res) => {
          expect(res).to.have.status(status.OK)
          /* eslint-disable no-unused-expressions */
          expect(res.body).to.not.be.null
          expect(res.body).to.have.property('name')
          expect(res.body).to.have.property('mainColor')
          expect(res.body).to.have.property('logo')
          expect(res.body).to.have.property('user')
          expect(res.body).to.have.property('initialized')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
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
    it('PUT (/) should be able to update a community info', async () => {
      let newCommunity = fakeCommunity
      newCommunity.name = 'Awesome Community'
      await agent.put('/api/v1/community')
        .set('Authorization', 'Bearer ' + accessToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/json')
        .send(newCommunity)
        .then((res) => {
          expect(res).to.have.status(status.OK)
          /* eslint-disable no-unused-expressions */
          expect(res.body).to.not.be.null
          expect(res.body).to.have.property('name')
          expect(res.body.name).to.be.equal(newCommunity.name)
          expect(res.body).to.have.property('mainColor')
          expect(res.body).to.have.property('logo')
          expect(res.body).to.have.property('user')
          expect(res.body).to.have.property('initialized')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          throw err
        })
    })
  })
})
