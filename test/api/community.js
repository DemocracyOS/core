const chai = require('chai')
const chaiHttp = require('chai-http')
const {
  OK,
  CREATED,
  FORBIDDEN,
  BAD_REQUEST
} = require('http-status')
const Community = require('../../models/community')

const expect = chai.expect
chai.use(chaiHttp)

// Global variables for testing
let agent = null // user agent, simulates a browser.
let bearerToken = null // bearer token provided by Keycloak

// describe('Community API (/api/v1/community)', () => {
//   before(async () => {
//     await require('../../server')
//     // Before starting the tests, make sure to prepare the enviroment
//     // That is, clean the database, or initialize anything you need before executing the suite of tests
//     await Community.remove({})
//   })

//   describe('Log in as an authorized user', () => {
//     before(async () => {
//       // Log In as aser
//       agent = await chai.request.agent('http://localhost:3000')
//     })
//     it('should get bearer token and save it', async () => {
//       // await agent.get('/auth/csrf')
//       //   .then((res) => {
//       //     // TODO
//       //   })
//       //   .catch((err) => {
//       //     throw err
//       //   })
//     })
//     it('GET / any user should be able to get the data of a community', async () => {
//       await agent.get('/api/v1.0/settings')
//         .then((res) => {
//           // expect(res).to.have.status(OK)
//           // TODO
//         })
//         .catch((err) => {
//           throw err
//         })
//     })
//     it('PUT / should be able to modify at least the name of a setting', async () => {
//       await agent.post('/api/v1.0/settings')
//         // .set('X-CSRF-TOKEN', csrfToken)
//         // .set('X-Requested-With', 'XMLHttpRequest')
//         // .set('Content-Type', 'application/x-www-form-urlencoded')
//         // .send(samplePostSetting)
//         .then((res) => {
//           /* eslint-disable no-unused-expressions */
//         })
//         .catch((err) => {
//           throw err
//         })
//     })
//   })
// })
