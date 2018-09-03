const { expect } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')
const { Types: { ObjectId } } = require('mongoose')
const fake = require('../fake')

const Document = require('../../models/document')
const document = require('../../db-api/document')

const documentSample = fake.document()
const customFormSample = fake.customForm()

describe('Document DB-APIs', () => {
  // ===================================================
  it('Document.create() should create a document', () => {
    // require module with rewire to override its internal Document reference
    const document = rewire('../../db-api/document')

    // replace Document constructor for a spy
    const DocumentMock = sinon.spy()

    // add a save method that only returns the data
    DocumentMock.prototype.save = () => { return Promise.resolve(documentSample) }

    // create a spy for the save method
    const save = sinon.spy(DocumentMock.prototype, 'save')

    // override Document inside `document/db-api/document`
    document.__set__('Document', DocumentMock)

    // call create method
    return document.create(documentSample, customFormSample)
      .then((result) => {
        sinon.assert.calledWithNew(DocumentMock)
        sinon.assert.calledWith(DocumentMock, documentSample)
        sinon.assert.calledOnce(save)
        expect(result).to.equal(documentSample)
      })
  })
  // ===================================================

  it('Document.get() should get a document', () => {
    const DocumentMock = sinon.mock(Document)

    DocumentMock
      .expects('findOne').withArgs({ _id: '5a5e29d948a9cc2fbeed02fa' })
      .chain('exec')
      .resolves(documentSample)

    return document.get({ _id: '5a5e29d948a9cc2fbeed02fa' })
      .then((result) => {
        DocumentMock.verify()
        DocumentMock.restore()
        expect(result).to.equal(documentSample)
      })
  })
  // ===================================================
  it('Document.list() should list all documents', () => {
    const DocumentMock = sinon.mock(Document)

    DocumentMock
      .expects('paginate').withArgs({}, { limit: 10, page: 1 })
      .resolves(documentSample)

    return document.list({}, { limit: 10, page: 1 })
      .then((result) => {
        DocumentMock.verify()
        DocumentMock.restore()
        expect(result).to.equal(documentSample)
      })
  })
  // ===================================================
  it('Document.update() should modify a document', () => {
    const DocumentMock = sinon.mock(Document)
    let documentSample = fake.document()
    documentSample.save = sinon.spy(() => documentSample)

    DocumentMock
      .expects('findOne').withArgs({ _id: '5a5e29d948a9cc2fbeed02fa' })
      .chain('exec')
      .resolves(documentSample)

    return document.update('5a5e29d948a9cc2fbeed02fa', { published: false }, customFormSample)
      .then((result) => {
        DocumentMock.verify()
        DocumentMock.restore()
        sinon.assert.calledOnce(documentSample.save)
        expect(result).to.have.property('published')
        expect(result.published).to.be.equal(false)
      })
  })
  // ===================================================
  it('Document.remove() should remove a document', () => {
    const DocumentMock = sinon.mock(Document)
    const remove = sinon.spy()

    DocumentMock
      .expects('findOne').withArgs({ _id: '5a5e29d948a9cc2fbeed02fa' })
      .chain('exec')
      .resolves({ remove })

    return document.remove('5a5e29d948a9cc2fbeed02fa')
      .then(() => {
        DocumentMock.verify()
        DocumentMock.restore()
        sinon.assert.calledOnce(remove)
      })
  })
})
