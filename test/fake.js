const faker = require('faker')
const { Types: { ObjectId } } = require('mongoose')

const community = () => {
  return {
    name: 'Platform for ' + faker.address.city(),
    mainColor: faker.internet.color(),
    logo: null,
    user: null,
    initialized: true
  }
}

const jsonSchemaProperties = (valid) => {
  let fields = {
    properties: {
      'checked': {
        'type': 'boolean',
        'title': faker.lorem.words(5),
        'description': faker.lorem.sentence(10),
        'default': false
      },
      'dimensions': {
        'type': 'object',
        'properties': {
          'width': {
            'type': 'integer',
            'title': faker.lorem.words(5),
            'description': faker.lorem.sentence(10),
            'default': 0
          },
          'height': {
            'type': 'integer',
            'title': faker.lorem.words(5),
            'description': faker.lorem.sentence(10),
            'default': 0
          }
        }
      },
      'id': {
        'type': 'integer',
        'title': faker.lorem.words(5),
        'description': faker.lorem.sentence(10),
        'default': 0
      },
      'name': {
        'type': 'string',
        'title': faker.lorem.words(5),
        'description': faker.lorem.sentence(10),
        'default': ''
      },
      'price': {
        'type': 'number',
        'title': faker.lorem.words(5),
        'description': faker.lorem.sentence(10),
        'default': 0
      },
      'tags': {
        'type': 'array',
        'items': {
          'type': 'string',
          'title': faker.lorem.words(5),
          'description': faker.lorem.sentence(10),
          'default': ''
        }
      }
    }
  }
  
  if(valid) {
    return fields
  }
  
  fields.properties.checked.default = 0;
  fields.properties.dimensions.height.default = 'fake';

  return fields
}

const documentType = () => {
  return {
    name: faker.lorem.words(4),
    icon: faker.lorem.word(),
    description: faker.lorem.sentence(10),
    fields: jsonSchemaProperties()
  }
}2

module.exports = {
  community,
  documentType,
  jsonSchemaProperties
}
