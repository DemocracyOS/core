const { expect } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')
const { Types: { ObjectId } } = require('mongoose')
const fake = require('../fake')

const User = require('../../models/user')
const user = require('../../db-api/user')

const userSample = fake.user()

describe('User DB-APIs', () => {
  // ===================================================
  it('User.create() should create a user', () => {
    // require module with rewire to override its internal User reference
    const user = rewire('../../db-api/user')

    // replace User constructor for a spy
    const UserMock = sinon.spy()

    // add a save method that only returns the data
    UserMock.prototype.save = () => { return Promise.resolve(userSample) }

    // create a spy for the save method
    const save = sinon.spy(UserMock.prototype, 'save')

    // override User inside `user/db-api/user`
    user.__set__('User', UserMock)

    // call create method
    return user.create(userSample)
      .then((result) => {
        sinon.assert.calledWithNew(UserMock)
        sinon.assert.calledWith(UserMock, userSample)
        sinon.assert.calledOnce(save)
        expect(result).to.equal(userSample)
      })
  })
  // ===================================================

  it('User.get() should get a user', () => {
    const UserMock = sinon.mock(User)

    UserMock
      .expects('findOne').withArgs({ _id: '5a5e29d948a9cc2fbeed02fa' })
      .chain('exec')
      .resolves(userSample)

    return user.get({ _id: '5a5e29d948a9cc2fbeed02fa' })
      .then((result) => {
        UserMock.verify()
        UserMock.restore()
        expect(result).to.equal(userSample)
      })
  })
  // ===================================================
  it('User.list() should list all users', () => {
    const UserMock = sinon.mock(User)

    UserMock
      .expects('paginate').withArgs({}, { limit: 10, page: 1 })
      .resolves(userSample)

    return user.list({}, { limit: 10, page: 1 })
      .then((result) => {
        UserMock.verify()
        UserMock.restore()
        expect(result).to.equal(userSample)
      })
  })
  // ===================================================
  it('User.update() should modify a user', () => {
    const UserMock = sinon.mock(User)
    let userSample = fake.user()
    userSample.save = sinon.spy(() => userSample)

    UserMock
      .expects('findOne').withArgs({ _id: '5a5e29d948a9cc2fbeed02fa' })
      .chain('exec')
      .resolves(userSample)

    return user.update('5a5e29d948a9cc2fbeed02fa', { fields: null })
      .then((result) => {
        UserMock.verify()
        UserMock.restore()
        sinon.assert.calledOnce(userSample.save)
        expect(result).to.have.property('fields')
        expect(result.fields).to.be.equal(null)
      })
  })
  // ===================================================
  it('User.remove() should remove a user', () => {
    const UserMock = sinon.mock(User)
    const remove = sinon.spy()

    UserMock
      .expects('findOne').withArgs({ _id: '5a5e29d948a9cc2fbeed02fa' })
      .chain('exec')
      .resolves({ remove })

    return user.remove('5a5e29d948a9cc2fbeed02fa')
      .then(() => {
        UserMock.verify()
        UserMock.restore()
        sinon.assert.calledOnce(remove)
      })
  })
})
