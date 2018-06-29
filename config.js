// This file serves as the entrypoint to all configuration loaded by the
// application. All defaults are assumed here, validation should also be
// completed here.

require('dotenv').config()

// ==============================================================================
//  CONFIG INITIALIZATION
// ==============================================================================

let keycloakRealm = null

switch (process.env.NODE_ENV) {
  case 'test':
    keycloakRealm = process.env.DEMOCRACYOS_AUTH_REALM_TEST
    break
  case 'dev':
    keycloakRealm = process.env.DEMOCRACYOS_AUTH_REALM_DEV
    break
  default:
    keycloakRealm = process.env.DEMOCRACYOS_AUTH_REALM
}

const CONFIG = {
  MONGO_URL: '',

  PORT: parseInt(process.env.DEMOCRACYOS_PORT, 10) || 3000,

  DEFAULT_LANG: process.env.DEMOCRACYOS_DEFAULT_LANG || 'en',

  EMAIL_SUBJECT_PREFIX: process.env.DEMOCRACYOS_EMAIL_SUBJECT_PREFIX || '[DemocracyOS]',

  SESSION_SECRET: process.env.DEMOCRACYOS_SESSION_SECRET || null,

  ROOT_URL: 'http://' + process.env.DEMOCRACYOS_HOST + ':' + process.env.DEMOCRACYOS_PORT,

  ADMIN_EMAIL: process.env.DEMOCRACYOS_ADMIN_EMAIL || null,

  // ------------------------------------------------------------------------------
  //  Keycloak configuration
  // ------------------------------------------------------------------------------

  KEYCLOAK_CONFIG: {
    'realm': keycloakRealm,
    'auth-server-url': process.env.DEMOCRACYOS_AUTH_SERVER_URL,
    'ssl-required': 'external',
    'resource': process.env.DEMOCRACYOS_AUTH_CLIENT,
    'public-client': true,
    'confidential-port': 0
  },
  KEYCLOAK_TOKEN_ENDPOINT: process.env.DEMOCRACYOS_AUTH_SERVER_URL + '/realms/' + keycloakRealm + '/protocol/openid-connect/token',
  CREDENTIALS_ADMIN_TEST: {
    'client_id': process.env.DEMOCRACYOS_AUTH_CLIENT,
    'grant_type': 'password',
    'username': process.env.DEMOCRACYOS_ADMIN_TEST_USERNAME,
    'password': process.env.DEMOCRACYOS_ADMIN_TEST_PASSWORD
  },
  // ------------------------------------------------------------------------------
  //  SMTP Server configuration
  // ------------------------------------------------------------------------------

  SMTP_HOST: process.env.DEMOCRACYOS_SMTP_HOST,
  SMTP_USERNAME: process.env.DEMOCRACYOS_SMTP_USERNAME,
  SMTP_PORT: process.env.DEMOCRACYOS_SMTP_PORT || 25,
  SMTP_PASSWORD: process.env.DEMOCRACYOS_SMTP_PASSWORD,
  SMTP_FROM_ADDRESS: process.env.DEMOCRACYOS_SMTP_FROM_ADDRESS
}

// ==============================================================================
//  CONFIG VALIDATION
// ==============================================================================

switch (process.env.NODE_ENV) {
  case 'test':
    CONFIG.MONGO_URL = process.env.DEMOCRACYOS_MONGO_URL_TEST
    break
  case 'dev':
    CONFIG.MONGO_URL = process.env.DEMOCRACYOS_MONGO_URL_DEV
    break
  default:
    CONFIG.MONGO_URL = process.env.DEMOCRACYOS_MONGO_URL
}

if (!CONFIG.SESSION_SECRET) {
  throw new Error(
    'DEMOCRACYOS_SESSION_SECRET must be provided in the environment to sign the session ID cookie'
  )
}

if (!CONFIG.SMTP_HOST || !CONFIG.SMTP_USERNAME || !CONFIG.SMTP_PASSWORD) {
  let missing = '\n---------------------------------'
  if (!CONFIG.SMTP_HOST) missing += '\n  DEMOCRACYOS_SMTP_HOST '
  if (!CONFIG.SMTP_USERNAME) missing += '\n  DEMOCRACYOS_SMTP_USERNAME '
  if (!CONFIG.SMTP_PASSWORD) missing += '\n  DEMOCRACYOS_SMTP_PASSWORD '
  missing += '\n---------------------------------'
  throw new Error(
    `An SMTP provider must be set to handle emails. \nMissing variables: ${missing}`
  )
}

module.exports = CONFIG
