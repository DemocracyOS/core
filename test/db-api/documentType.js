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
