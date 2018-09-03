const { expect } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')
const { Types: { ObjectId } } = require('mongoose')
const fake = require('../fake')

const CustomForm = require('../../models/customForm')
const customForm = require('../../db-api/customForm')

// Make a sample
const customFormSample = fake.customForm()

describe('CustomForm DB-APIs', () => {
  // ===================================================
  it('CustomForm.create() should create a customForm', () => {
    // require module with rewire to override its internal Document reference
    const customForm = rewire('../../db-api/customForm')

    // replace Document constructor for a spy
    const CustomFormMock = sinon.spy()

    // add a save method that only returns the data
    CustomFormMock.prototype.save = () => { return Promise.resolve(customFormSample) }
    // create a spy for the save method
    const save = sinon.spy(CustomFormMock.prototype, 'save')

    // override Document inside `document/db-api/document`
    customForm.__set__('CustomForm', CustomFormMock)

    // call create method
    return customForm.create(customFormSample)
      .then((result) => {
        sinon.assert.calledWithNew(CustomFormMock)
        sinon.assert.calledWith(CustomFormMock, customFormSample)
        sinon.assert.calledOnce(save)
        expect(result).to.equal(customFormSample)
      })
  })

  // ===================================================
  it('CustomForm.get() should get the only customForm created in the database', () => {
    const CustomFormMock = sinon.mock(CustomForm)

    CustomFormMock
      .expects('findOne').withArgs({ _id: '5a5e29d948a9cc2fbeed02fa' })
      .chain('exec')
      .resolves(customFormSample)

    return customForm.get({ _id: '5a5e29d948a9cc2fbeed02fa' })
      .then((result) => {
        CustomFormMock.verify()
        CustomFormMock.restore()
        expect(result).to.equal(customFormSample)
      })
  })
  // ===================================================
  it('CustomForm.update() should update a customForm', () => {
    const CustomFormMock = sinon.mock(CustomForm)
    const save = sinon.spy(() => customFormSample)
    const changedSample = customFormSample
    // Change the customForm name
    changedSample.fields.properties['newField'] = {
      type: 'boolean',
      title: 'Another field added'
    }

    CustomFormMock
      .expects('findOne').withArgs({ _id: '5a5e29d948a9cc2fbeed02fa' })
      .chain('exec')
      .resolves({ save })

    return customForm.update('5a5e29d948a9cc2fbeed02fa', changedSample)
      .then((result) => {
        CustomFormMock.verify()
        CustomFormMock.restore()
        sinon.assert.calledOnce(save)
        expect(Object.keys(result.fields.properties).length).to.be.equal(Object.keys(changedSample.fields.properties).length)
        expect(result.fields.properties['newField']).to.be.an('object')
        expect(result.fields.properties['newField'].type).to.be.equal('boolean')
      })
  })
  // ===================================================
  it('CustomForm.list() should list customForms', () => {
    const CustomFormMock = sinon.mock(CustomForm)

    CustomFormMock
      .expects('paginate').withArgs({}, { limit: 10, page: 1 })
      .resolves(customFormSample)

    return customForm.list({}, { limit: 10, page: 1 })
      .then((result) => {
        CustomFormMock.verify()
        CustomFormMock.restore()
        expect(result).to.equal(customFormSample)
      })
  })
  // ===================================================
  it('CustomForm.remove() should remove a customForm', () => {
    const CustomFormMock = sinon.mock(CustomForm)
    const remove = sinon.spy()

    CustomFormMock
      .expects('findOne').withArgs({ _id: '5a5e29d948a9cc2fbeed02fa' })
      .chain('exec')
      .resolves({ remove })

    return customForm.remove('5a5e29d948a9cc2fbeed02fa')
      .then(() => {
        CustomFormMock.verify()
        CustomFormMock.restore()
        sinon.assert.calledOnce(remove)
      })
  })
})
