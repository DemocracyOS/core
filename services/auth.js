const Keycloak = require('keycloak-connect')
const { KEYCLOAK_CONFIG } = require('../config')
const mongoStore = require('./sessions')

const keycloak = new Keycloak({ store: mongoStore }, KEYCLOAK_CONFIG)

module.exports = keycloak
