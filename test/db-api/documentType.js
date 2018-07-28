const { expect } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')
const { Types: { ObjectId } } = require('mongoose')
const fake = require('../fake')

const DocumentType = require('../../models/documentType')
const documentType = require('../../db-api/documentType')

// Make a sample
const documentTypeSample = fake.documentType()
let mockedId = null

describe('DocumentType DB-APIs', () => {
  // ===================================================
  it('DocumentType.create() should create a documentType', () => {
    // require module with rewire to override its internal Settings reference
    const documentType = rewire('../../db-api/documentType')
    // replace Setting constructor for a spy
    const DocumentTypeMock = sinon.spy()

    // add a findOne method that only returns null
    DocumentTypeMock.findOne = () => { return Promise.resolve(null) }

    // add a save method that only returns the data
    DocumentTypeMock.prototype.save = () => { return Promise.resolve(documentTypeSample) }

    // create a spy for the findOne method
    sinon.spy(DocumentTypeMock.findOne)
    // create a spy for the save method
    const save = sinon.spy(DocumentTypeMock.prototype, 'save')

    // override Setting inside `db-api/documentType`
    documentType.__set__('DocumentType', DocumentTypeMock)
    // call create method
    return documentType.create(documentTypeSample)
      .then((result) => {
        sinon.assert.calledWithNew(DocumentTypeMock)
        sinon.assert.calledWith(DocumentTypeMock, documentTypeSample)
        sinon.assert.calledOnce(save)
        expect(result).to.equal(documentTypeSample)
      })
  })
  // ===================================================
  it('DocumentType.get() should get the only documentType created in the database', () => {
    const DocumentTypeMock = sinon.mock(DocumentType)

    DocumentTypeMock
      .expects('findOne').withArgs()
      .chain('exec')
      .resolves(documentTypeSample)

    return documentType.get('5a5e29d948a9cc2fbeed02fa')
      .then((result) => {
        DocumentTypeMock.verify()
        DocumentTypeMock.restore()
        expect(result).to.equal(documentTypeSample)
      })
  })
  // ===================================================
  it('DocumentType.update() should update a documentType', () => {
    const DocumentTypeMock = sinon.mock(DocumentType)
    const save = sinon.spy(() => documentTypeSample)
    const changedSample = documentTypeSample
    // Change the documentType name
    changedSample.fields.properties['newField'] = {
      type: 'boolean',
      title: 'Another field added'
    }

    DocumentTypeMock
      .expects('findOne').withArgs()
      .chain('exec')
      .resolves({ save })

    return documentType.update(changedSample)
      .then((result) => {
        DocumentTypeMock.verify()
        DocumentTypeMock.restore()
        sinon.assert.calledOnce(save)
        expect(Object.keys(result.fields.properties).length).to.be.equal(Object.keys(changedSample.fields.properties).length)
        expect(result.fields.properties['newField']).to.be.an('object')
        expect(result.fields.properties['newField'].type).to.be.equal('boolean')
      })
  })
})
