const { expect } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')
const { Types: { ObjectId } } = require('mongoose')
const fake = require('../fake')

const GeneralComment = require('../../models/generalComment')
const generalComment = require('../../db-api/generalComment')

const generalCommentSample = fake.generalComment()

describe('GeneralComment DB-APIs', () => {
  // ===================================================
  it('GeneralComment.create() should create a generalComment', () => {
    // require module with rewire to override its internal GeneralComment reference
    const generalComment = rewire('../../db-api/generalComment')

    // replace GeneralComment constructor for a spy
    const GeneralCommentMock = sinon.spy()

    // add a save method that only returns the data
    GeneralCommentMock.prototype.save = () => { return Promise.resolve(generalCommentSample) }

    // create a spy for the save method
    const save = sinon.spy(GeneralCommentMock.prototype, 'save')

    // override GeneralComment inside `generalComment/db-api/generalComment`
    generalComment.__set__('GeneralComment', GeneralCommentMock)

    // call create method
    return generalComment.create(generalCommentSample)
      .then((result) => {
        sinon.assert.calledWithNew(GeneralCommentMock)
        sinon.assert.calledWith(GeneralCommentMock, generalCommentSample)
        sinon.assert.calledOnce(save)
        expect(result).to.equal(generalCommentSample)
      })
  })
})
