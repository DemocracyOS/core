const { expect } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')
const { Types: { ObjectId } } = require('mongoose')
const fake = require('../fake')

const Comment = require('../../models/comment')
const comment = require('../../db-api/comment')

const commentSample = fake.comment()

describe('Comment DB-APIs', () => {
  // ===================================================
  it('Comment.create() should create a comment', () => {
    // require module with rewire to override its internal Comment reference
    const comment = rewire('../../db-api/comment')

    // replace Comment constructor for a spy
    const CommentMock = sinon.spy()

    // add a save method that only returns the data
    CommentMock.prototype.save = () => { return Promise.resolve(commentSample) }

    // create a spy for the save method
    const save = sinon.spy(CommentMock.prototype, 'save')

    // override Comment inside `comment/db-api/comment`
    comment.__set__('Comment', CommentMock)

    // call create method
    return comment.create(commentSample)
      .then((result) => {
        sinon.assert.calledWithNew(CommentMock)
        sinon.assert.calledWith(CommentMock, commentSample)
        sinon.assert.calledOnce(save)
        expect(result).to.equal(commentSample)
      })
  })
})
