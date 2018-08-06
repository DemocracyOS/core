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

const documentType = (valid) => {
  return {
    name: faker.lorem.words(4),
    icon: faker.lorem.word(),
    description: faker.lorem.sentence(10),
    fields: {
      blocks: [
        {
          name: 'Authors contact info',
          fields: [
            'authorEmail',
            'authorName',
            'authorSurname'
          ]
        },
        {
          name: 'Organization info',
          fields: [
            'orgEmail',
            'orgAdress',
            'orgTel'
          ]
        }
      ],
      properties: {
        'authorName': {
          type: 'string',
          title: "Author's name"
        },
        'authorSurname': {
          type: 'string',
          title: "Author's surname"
        },
        'authorEmail': {
          type: valid !== undefined && !valid ? 'strong' : 'string',
          title: "Author's email"
        },
        'orgTel': {
          type: 'string',
          title: "Org's tel"
        },
        'orgEmail': {
          type: valid !== undefined && !valid ? 'strong' : 'string',
          title: "Org's email"
        },
        'orgAdress': {
          type: 'string',
          title: "Org's address"
        }
      },
      required: [
        'authorName',
        'authorSurname',
        'authorEmail'
      ]
    }
  }
}

const document = (valid, published, authorId, documentTypeId) => {
  return {
    authorId: authorId || '40bb3a93-36c2-4fe5-8fa1-5bd488874cda',
    published: !!published,
    publishedAt: faker.date.recent(),
    documentType: documentTypeId || null,
    documentTypeVersion: 0,
    content: {
      title: faker.lorem.words(4),
      brief: faker.lorem.sentence(12),
      fields: {
        authorName: valid !== undefined && !valid ? faker.random.number() : faker.name.firstName(),
        authorSurname: faker.name.lastName(),
        authorEmail: faker.internet.email(),
        orgTel: valid !== undefined && !valid ? faker.random.number() : faker.company.companyName()
      }
    }
  }
}

module.exports = {
  community,
  documentType,
  document
}
