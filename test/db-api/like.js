const { expect } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
const fake = require('../fake')

const LikeModel = require('../../models/like')
const dbLike = require('../../db-api/like')

const likeSample = fake.like()

describe('Like DB-APIs', () => {
  it('Like.create() should create a like for a comment', () => {
    const like = rewire('../../db-api/like')

    const LikeMock = sinon.spy()

    LikeMock.prototype.save = () => { return Promise.resolve(likeSample) }

    const save = sinon.spy(LikeMock.prototype, 'save')

    like.__set__('Like', LikeMock)

    return like.create(likeSample)
      .then((result) => {
        sinon.assert.calledWithNew(LikeMock)
        sinon.assert.calledWith(LikeMock, likeSample)
        sinon.assert.calledOnce(save)
        expect(result).to.equal(likeSample)
      })
  })
  // ===================================================
  it('Like.get() should get a like for a comment', () => {
    const LikeMock = sinon.mock(LikeModel)

    LikeMock
      .expects('findOne').withArgs({
        user: '5bbe939984792fdbbc2143a1',
        comment: '5bbe939984792f07bc3113b5'
      })
      .resolves(likeSample)
    
    return dbLike.get({
      user: '5bbe939984792fdbbc2143a1',
      comment: '5bbe939984792f07bc3113b5'
    }).then((result) => {
      LikeMock.verify()
      LikeMock.restore()
      expect(result).to.equal(likeSample)
    })
  })
  // ===================================================
  it('Like.remove() should remove a like', () => {
    const LikeMock = sinon.mock(LikeModel)
    const remove = sinon.spy()

    LikeMock
      .expects('findOne').withArgs({_id: '5bbe939984792f07bc2143a2'})
      .resolves({ remove })

    return dbLike.remove('5bbe939984792f07bc2143a2')
      .then(() => {
        LikeMock.verify()
        LikeMock.restore()
        sinon.assert.calledOnce(remove)
      })
  })
})