// This file serves as the entrypoint to all configuration loaded by the
// application. All defaults are assumed here, validation should also be
// completed here.

require('dotenv').config()

// ==============================================================================
//  CONFIG INITIALIZATION
// ==============================================================================

const CONFIG = {
  MONGO_URL: process.env.DEMOCRACYOS_MONGO_URL,

  PORT: parseInt(process.env.PORT, 10) || 3000,

  DEFAULT_LANG: process.env.DEMOCRACYOS_DEFAULT_LANG || 'en',

  EMAIL_SUBJECT_PREFIX: process.env.DEMOCRACYOS_EMAIL_SUBJECT_PREFIX || '[DemocracyOS]',

  SESSION_SECRET: process.env.DEMOCRACYOS_SESSION_SECRET || null,

  ROOT_URL: process.env.DEMOCRACYOS_ROOT_URL || null,

  ADMIN_EMAIL: process.env.DEMOCRACYOS_ADMIN_EMAIL || null,

  // ------------------------------------------------------------------------------
  //  Keycloak configuration
  // ------------------------------------------------------------------------------

  KEYCLOAK_CONFIG: {
    'realm': process.env.KEYCLOAK_REALM_NAME,
    'auth-server-url': process.env.KEYCLOAK_AUTH_SERVER_URL,
    'ssl-required': process.env.KEYCLOAK_SSL_REQUIRED,
    'resource': process.env.KEYCLOAK_RESOURCE,
    'public-client': process.env.KEYCLOAK_PUBLIC_CLIENT,
    'use-resource-role-mappings': true,
    'confidential-port': process.env.KEYCLOAK_CONFIDENTIAL_FORM || 0
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

if (process.env.NODE_ENV === 'test') {
  CONFIG.MONGO_URL = 'mongodb://localhost/DemocracyOS-test'
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
