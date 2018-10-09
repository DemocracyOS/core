// This file serves as the entrypoint to all configuration loaded by the
// application. All defaults are assumed here, validation should also be
// completed here.

require('dotenv').config()

// ==============================================================================
//  CONFIG INITIALIZATION
// ==============================================================================

const CONFIG = {
  MONGO_URL: process.env.MONGO_URL,

  PORT: parseInt(process.env.PORT, 10) || 3000,

  SESSION_SECRET: process.env.SESSION_SECRET || null,

  // ROOT_URL: 'http://' + process.env.HOST + ':' + process.env.PORT,

  // ------------------------------------------------------------------------------
  //  Keycloak configuration
  // ------------------------------------------------------------------------------

  KEYCLOAK_CONFIG: {
    'realm': process.env.AUTH_REALM,
    'auth-server-url': process.env.AUTH_SERVER_URL,
    'ssl-required': 'external',
    'resource': process.env.AUTH_CLIENT,
    'public-client': true,
    'confidential-port': 0
  },

  KEYCLOAK_TOKEN_ENDPOINT: process.env.AUTH_SERVER_URL + '/realms/' + process.env.AUTH_REALM + '/protocol/openid-connect/token',

  CREDENTIALS_ADMIN_TEST: {
    'client_id': process.env.AUTH_CLIENT || null,
    'grant_type': 'password',
    'username': process.env.ADMIN_TEST_USERNAME || null,
    'password': process.env.ADMIN_TEST_PASSWORD || null
  },

  SETUP: {
    COMMUNITY_NAME: process.env.COMMUNITY_NAME || 'My community',
    COMMUNITY_COLOR: '#' + (process.env.COMMUNITY_COLOR_HEX || '3177cc')
  }
}

if (!CONFIG.SESSION_SECRET) {
  throw new Error(
    'SESSION_SECRET must be provided in the environment to sign the session ID cookie'
  )
}

module.exports = CONFIG
