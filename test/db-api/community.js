const { expect } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
require('sinon-mongoose')
const { Types: { ObjectId } } = require('mongoose')

const Community = require('../../models/community')
const community = require('../../db-api/community')

// Make a sample
// const communitySample = { }

describe('Community DB-APIs', () => {
  it('Community.get() should get the only one community', () => {

  })
  it('Community.update() should update the only one community', () => {

  })
})
