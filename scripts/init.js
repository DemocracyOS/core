const mongoose = require('mongoose')
const Community = require('../models/community')
const dbCommunity = require('../db-api/community')
const CustomForm = require('../models/customForm')
const dbCustomForm = require('../db-api/customForm')
const config = require('../config')
const log = require('../services/logger')
// const { NODE_ENV } = process.env

// Error Definitions
// class NoEnvDefined extends Error { }
class DatabaseNotEmpty extends Error { }

async function checkDB () {
  log.debug('* Checking if database has data on it')
  let community = await Community.findOne({})
  if (community) throw new DatabaseNotEmpty('ERROR There is at least one community already on the DB')
  let customForm = await CustomForm.findOne({})
  if (customForm) throw new DatabaseNotEmpty('ERROR There is at least one document type already on the DB')
  log.debug('--> OK')
}

// async function checkEnv () {
//   log.debug(`* Checking if ENV is defined... [${NODE_ENV}] defined`)
//   if (NODE_ENV === undefined) throw new NoEnvDefined('ERROR You need to run the script with NODE_ENV, like "dev" or "prod"')
//   log.debug('--> OK')
// }

async function startSetup () {
  try {
    await checkDB()
    log.debug('* Creating community...')
    let profileSchema = await dbCustomForm.create({
      name: 'User Profile',
      icon: 'fas fa-user',
      description: 'Template for a user profile',
      version: 0,
      fields: {
        'blocks': [
          {
            'fields': [
              'twitter',
              'facebook'
            ],
            'name': 'Social Media'
          },
          {
            'fields': [
              'bio'
            ],
            'name': 'About the user'
          }
        ],
        'properties': {
          'bio': {
            'type': 'string',
            'title': 'User information'
          },
          'twitter': {
            'type': 'string',
            'title': "User's surname"
          },
          'facebook': {
            'type': 'string',
            'title': "User's facebook"
          }
        },
        'required': [],
        'richText': [],
        'allowComments': []
      }
    })
    await dbCommunity.create({
      name: config.SETUP.COMMUNITY_NAME,
      mainColor: config.SETUP.COMMUNITY_COLOR,
      logo: null,
      user: null,
      userProfileSchema: profileSchema._id,
      initialized: true,
      permissions: {
        user: {}, // Permissions for users
        accountable: { // Permissions for accountables
          documentCreationLimit: 1
        },
        admin: {} // Permissions for admin
      }
    })
    log.debug('--> OK')
    log.debug('* Creating document type...')
    await dbCustomForm.create({
      fields: {
        'blocks': [
          {
            'fields': [
              'title',
              'imgCover',
              'youtubeId',
              'fundation'
            ],
            'name': 'Project\'s basic info'
          },
          {
            'fields': [
              'articles'
            ],
            'name': 'Articles of the project'
          }
        ],
        'properties': {
          'title': {
            'type': 'string',
            'title': 'Project\'s title'
          },
          'imageCover': {
            'anyof': [
              { 'type': 'null' },
              { 'type': 'string' }
            ],
            'title': 'URL for the cover of the image'
          },
          'fundation': {
            'type': 'object',
            'title': 'Project\'s fundations'
          },
          'articles': {
            'type': 'object',
            'title': 'Articles'
          },
          'youtubeId': {
            'anyof': [
              { 'type': 'null' },
              { 'type': 'String' }
            ],
            'title': 'Youtube Video ID'
          },
          'closingDate': {
            'oneOf': [
              { 'type': 'null' },
              { 'type': 'string' }
            ],
            'title': 'Closing date (to participate)'
          },
          'closure': {
            'anyof': [
              { 'type': 'null' },
              { 'type': 'object' }
            ],
            'title': 'Closure of the document'
          }
        },
        'required': [
          'title',
          'fundation',
          'articles'
        ],
        'richText': [
          'fundation',
          'articles'
        ],
        'allowComments': [
          'fundation',
          'articles'
        ]
      },
      name: 'Project',
      icon: 'far fa-files',
      description: 'This is the template of fields for projects',
      version: 0
    })
    log.debug('--> OK')
    log.debug('--> Setup finished!')
    process.exit(0) // Success
  } catch (err) {
    log.error(err.message)
    log.error('ERROR Setup stopped unexpectly')
    process.exit(1) // Error
  }
}

async function execute () {
  try {
    // await checkEnv()
    log.debug(`* Connecting to the database...`)
    mongoose
      .connect(config.MONGO_URL, { useNewUrlParser: true })
      .then(() => {
        log.debug('--> OK')
        startSetup()
      })
      .catch((err) => {
        log.error(err)
        log.error('ERROR Setup stopped unexpectly')
        process.exit(1)
      })
  } catch (err) {
    log.debug(err.message)
    log.error('ERROR Setup stopped unexpectly')
    process.exit(1) // Error
  }
}

mongoose.Promise = global.Promise

log.debug(`DemocracyOS - core`)
log.debug(`Seeding mongodb with init values.`)
log.debug('================================================')
execute()
