const { expect } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')
const { Types: { ObjectId } } = require('mongoose')

const Community = require('../../models/community')
const community = require('../../db-api/community')

// Make a sample
const communitySample = {
  name: 'A testing community',
  mainColor: '#425cf4',
  logo: null,
  user: null,
  initialized: true
}

describe('Community DB-APIs', () => {
  // ===================================================
  it('Community.create() should create a community', () => {
    // require module with rewire to override its internal Settings reference
    const community = rewire('../../db-api/community')
    // replace Setting constructor for a spy
    const CommunityMock = sinon.spy()

    // add a findOne method that only returns null
    CommunityMock.findOne = () => { return Promise.resolve(null) }

    // add a save method that only returns the data
    CommunityMock.prototype.save = () => { return Promise.resolve(communitySample) }

    // create a spy for the findOne method
    sinon.spy(CommunityMock.findOne)
    // create a spy for the save method
    const save = sinon.spy(CommunityMock.prototype, 'save')

    // override Setting inside `db-api/community`
    community.__set__('Community', CommunityMock)
    // call create method
    return community.create(communitySample)
      .then((result) => {
        sinon.assert.calledWithNew(CommunityMock)
        sinon.assert.calledWith(CommunityMock, communitySample)
        sinon.assert.calledOnce(save)
        expect(result).to.equal(communitySample)
      })
  })
  // ===================================================
  it('Community.get() should get the only community created in the database', () => {
    const CommunityMock = sinon.mock(Community)

    CommunityMock
      .expects('findOne').withArgs({})
      .chain('exec')
      .resolves(communitySample)

    return community.get()
      .then((result) => {
        CommunityMock.verify()
        CommunityMock.restore()
        expect(result).to.equal(communitySample)
      })
  })
  // ===================================================
  it('Community.update() should update the only community created in the database', () => {
    const CommunityMock = sinon.mock(Community)
    const save = sinon.spy(() => communitySample)
    const changedSample = communitySample
    const newName = 'Another Name'
    // Change the community name
    changedSample.name = newName

    CommunityMock
      .expects('findOne').withArgs({})
      .chain('exec')
      .resolves({ save })

    return community.update(changedSample)
      .then((result) => {
        CommunityMock.verify()
        CommunityMock.restore()
        sinon.assert.calledOnce(save)
        expect(result.name).to.be.equal(newName)
      })
  })
})
