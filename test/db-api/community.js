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
