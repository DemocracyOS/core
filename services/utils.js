const crypto = require('crypto-js')
const jsonDiff = require('json-diff')
// const auth = require('../services/auth')
// const log = require('./logger')
// const errors = require('./errors')

const isAdmin = (token, request) => {
  return token.hasRole('realm:admin')
}

const allowedFieldsFor = (user) => {
  let selectedFields = {}
  if (user && user.role === 'admin') return {}
  if (user && user.isOwner) selectedFields.email = 1
  selectedFields._id = 1
  selectedFields.name = 1
  selectedFields.bio = 1
  selectedFields.username = 1
  selectedFields.createdAt = 1
  return selectedFields
}

// return an array of objects according to key, value, or key and value matching
const getObjects = (obj, key, val) => {
  let objects = []
  for (let i in obj) {
    if (!obj.hasOwnProperty(i)) continue
    if (typeof obj[i] === 'object') {
      objects = objects.concat(getObjects(obj[i], key, val))
    } else
    // if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
    if ((i === key && obj[i] === val) || (i === key && val === '')) { //
      objects.push(obj)
    } else if (obj[i] === val && key === '') {
      // only add if the object is not already in the array
      if (objects.lastIndexOf(obj) === -1) {
        objects.push(obj)
      }
    }
  }
  return objects
}

// return an array of values that match on a certain key
const getValues = (obj, key) => {
  let objects = []
  for (let i in obj) {
    if (!obj.hasOwnProperty(i)) continue
    if (typeof obj[i] === 'object') {
      objects = objects.concat(getValues(obj[i], key))
    } else if (i === key) {
      objects.push(obj[i])
    }
  }
  return objects
}

const getKeys = (obj, val) => {
// return an array of keys that match on a certain value
  let objects = []
  for (let i in obj) {
    if (!obj.hasOwnProperty(i)) continue
    if (typeof obj[i] === 'object') {
      objects = objects.concat(getKeys(obj[i], val))
    } else if (obj[i] === val) {
      objects.push(i)
    }
  }
  return objects
}

const hashDocumentText = (document) => {
  return crypto.MD5(getValues(document, 'text').join('')).toString(crypto.enc.Hex)
}

const getJsonDiffs = (oldJson, newJson) => {
  return jsonDiff.diff(oldJson, newJson)
}

module.exports = {
  isAdmin,
  getObjects,
  getValues,
  getKeys,
  hashDocumentText,
  allowedFieldsFor,
  getJsonDiffs
}
