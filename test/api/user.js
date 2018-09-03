const chai = require('chai')
const chaiHttp = require('chai-http')
const status = require('http-status')
const User = require('../../models/user')
const Community = require('../../models/community')
const CustomForm = require('../../models/customForm')
const config = require('../../config')
const fake = require('../fake')

const expect = chai.expect
chai.use(chaiHttp)

let fakeCommunity = null
let fakeUserProfileCustomForm = fake.userProfileCustomForm()
let newUserProfileCustomForm = null

// Global variables for testing
let agent = null // user agent, simulates a browser.
let keycloakAgent = null // keycloak agent, simulates a browser.
let accessToken = null // bearer token provided by Keycloak

describe('User API (/api/v1/users)', () => {
  before(async () => {
    await require('../../server')
    // Before starting the tests, make sure to prepare the enviroment
    // That is, clean the database, or initialize anything you need before executing the suite of tests
    await User.remove({})
    await Community.remove({})
    await CustomForm.remove({})
    newUserProfileCustomForm = await (new CustomForm(fakeUserProfileCustomForm)).save()
    fakeCommunity = fake.community(newUserProfileCustomForm.id)
    await (new Community(fakeCommunity)).save()
  })

  // describe('As anonymous user', () => {
  //   before(async () => {
  //     // Create the agent
  //     agent = await chai.request.agent(config.ROOT_URL)
  //   })
  //   it('GET (/) Anyone should be able to get the community data', async () => {
  //     await agent.get('/api/v1/community')
  //       .then((res) => {
  //         expect(res).to.have.status(status.OK)
  //         /* eslint-disable no-unused-expressions */
  //         expect(res.body).to.not.be.null
  //         expect(res.body).to.have.property('name')
  //         expect(res.body).to.have.property('mainColor')
  //         expect(res.body).to.have.property('logo')
  //         expect(res.body).to.have.property('user')
  //         expect(res.body).to.have.property('userProfileSchema')
  //         expect(res.body.userProfileSchema).to.be.an('object')
  //         expect(res.body).to.have.property('initialized')
  //         expect(res.body).to.have.property('createdAt')
  //         expect(res.body).to.have.property('updatedAt')
  //       })
  //       .catch((err) => {
  //         // expect(err).to.have.status(status.FORBIDDEN)
  //         throw err
  //       })
  //   })
  // })
  describe('As an logged user', () => {
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
    it('PUT (/) should be able to update "my" profile info', async () => {
      // let newCommunity = fakeCommunity
      await agent.put('/api/v1/users')
        .set('Authorization', 'Bearer ' + accessToken)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/json')
        .send({
          fields: {
            facebook: 'https://facebook.com/fakeProfile',
            twitter: 'https://twitter.com/fakeProfile'
          }
        })
        .then((res) => {
          expect(res).to.have.status(status.OK)
          /* eslint-disable no-unused-expressions */
          expect(res.body).to.not.be.null
          expect(res.body).to.have.property('keycloak')
          expect(res.body).to.have.property('username')
          expect(res.body).to.have.property('avatar')
          expect(res.body).to.have.property('fields')
          expect(res.body.fields).to.have.property('facebook')
          expect(res.body.fields).to.have.property('twitter')
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
        })
        .catch((err) => {
          throw err
        })
    })
  })
})
