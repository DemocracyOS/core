const mongoose = require('mongoose')
const Community = require('./models/community')
const dbCommunity = require('./db-api/community')
const DocumentType = require('./models/documentType')
const dbDocumentType = require('./db-api/documentType')
const DocumentTypeVersion = require('./models/documentTypeVersion')
const dbDocumentTypeVersion = require('./db-api/documentTypeVersion')
const config = require('./config')
const log = require('./services/logger')
const { NODE_ENV } = process.env

// Error Definitions
class NoEnvDefined extends Error { }
class DatabaseNotEmpty extends Error { }

async function checkDB () {
  log.debug('* Checking if database has data on it')
  let community = await Community.findOne({})
  if (community) throw new DatabaseNotEmpty('ERROR There is at least one community already on the DB')
  let documentType = await DocumentType.findOne({})
  if (documentType) throw new DatabaseNotEmpty('ERROR There is at least one document type already on the DB')
  let documentTypeVersions = await DocumentTypeVersion.findOne({})
  if (documentTypeVersions) throw new DatabaseNotEmpty('ERROR There is at least one version of a document type already on the DB')
  log.debug('--> OK')
}

async function checkEnv () {
  log.debug(`* Checking if ENV is defined... [${NODE_ENV}] defined`)
  if (NODE_ENV === undefined) throw new NoEnvDefined('ERROR You need to run the script with NODE_ENV, like "dev" or "prod"')
  log.debug('--> OK')
}

async function startSetup () {
  try {
    await checkDB()
    log.debug('* Creating community...')
    await dbCommunity.create({
      name: config.SETUP.COMMUNITY_NAME,
      mainColor: config.SETUP.COMMUNITY_COLOR,
      logo: null,
      user: null,
      initialized: true
    })
    log.debug('--> OK')
    log.debug('* Creating document type...')
    await dbDocumentType.create({
      name: config.SETUP.DOCUMENT_TYPE_NAME,
      icon: 'fa-file',
      description: '- To be filled -',
      fields: {
        blocks: [],
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
            type: 'string',
            title: "Author's email"
          }
        },
        required: [
          'authorName',
          'authorSurname',
          'authorEmail'
        ]
      }
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
    await checkEnv()
    log.debug(`* Connecting to the database...`)
    mongoose
      .connect(config.MONGO_URL)
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

log.debug(`DemocracyOS - v3 core`)
log.debug(`Seeding mongodb with init values.`)
log.debug('================================================')
execute()
