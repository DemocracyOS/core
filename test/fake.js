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

module.exports = {
  community
}
