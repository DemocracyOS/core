// // Importing the connection to the `bookshelf` db.
// var bookshelfConn = require('./database');

// // Importing the Mongoose model we'll use to write to the db.
// var Book = require('./models/Book');

// // Importing the Data to populate the db.
// var books = require('./dataset');

// // When the connection is ready, do the music!
// bookshelfConn.on('open', function () {
//   // Here we'll keep an array of Promises
//   var booksOps = [];

//   // We drop the db as soon the connection is open
//   bookshelfConn.db.dropDatabase(function () {
//     console.log('Database dropped');
//   });

//   // Creating a Promise for each save operation
//   books.forEach(function (book) {
//     booksOps.push(saveBookAsync(book));
//   });

//   // Running all the promises sequentially, and THEN
//   // closing the database.
//   Promise.all(booksOps).then(function () {
//     bookshelfConn.close(function () {
//       console.log('Mongoose connection closed!');
//     });
//   });

//   // This function returns a Promise.
//   function saveBookAsync(book) {
//     return new Promise(function (resolve, reject) {
//       new Book(book).save(function (err) {
//         if (err) reject(err);
//         else resolve();
//       });
//     });
//   }
// });
// const log = require('./services/logger')
// const config = require('./services/mongoose')
// const mongoose = require('./services/mongoose')

const mongoose = require('mongoose')
const Community = require('./models/community')
const dbCommunity = require('./db-api/community')
const DocumentType = require('./models/documentType')
const dbDocumentType = require('./db-api/documentType')
const DocumentTypeVersion = require('./models/documentTypeVersion')
const dbDocumentTypeVersion = require('./db-api/documentTypeVersion')
const config = require('./config')
// const log = require('./logger')
const { NODE_ENV } = process.env

// Error Definitions
class NoEnvDefined extends Error { }
class DatabaseNotEmpty extends Error { }

async function checkDB () {
  console.info('* Checking if database has data on it')
  let community = await Community.findOne({})
  if (community) throw new DatabaseNotEmpty('X-- There is at least one community already on the DB')
  let documentType = await DocumentType.findOne({})
  if (documentType) throw new DatabaseNotEmpty('X-- There is at least one document type already on the DB')
  let documentTypeVersions = await DocumentTypeVersion.findOne({})
  if (documentTypeVersions) throw new DatabaseNotEmpty('X-- There is at least one version of a document type already on the DB')
  console.log('--> OK')
}

async function checkEnv () {
  console.log(`* Checking if ENV is defined... [${NODE_ENV}] defined`)
  if (NODE_ENV === undefined) throw new NoEnvDefined('X-- You need to run the script with NODE_ENV, like "dev" or "prod"')
  console.log('--> OK')
}

async function startSetup () {
  try {
    await checkDB()
    console.log('* Creating community...')
    await dbCommunity.create({
      name: config.SETUP.COMMUNITY_NAME,
      mainColor: config.SETUP.COMMUNITY_COLOR,
      logo: null,
      user: null,
      initialized: true
    })
    console.log('--> OK')
    console.log('* Creating document type...')
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
    console.log('--> OK')
    console.log('--> Setup finished!')
    process.exit(0) // Success
  } catch (err) {
    console.log(err.message)
    console.error('X-- Setup stopped unexpectly')
    process.exit(1) // Error
  }
}

async function execute () {
  try {
    await checkEnv()
    console.log(`* Connecting to the database...`)
    mongoose
      .connect(config.MONGO_URL)
      .then(() => {
        console.log('--> OK')
        startSetup()
      })
      .catch((err) => {
        console.error(err)
        console.error('X-- Setup stopped unexpectly')
        process.exit(1)
      })
  } catch (err) {
    console.log(err.message)
    console.error('X-- Setup stopped unexpectly')
    process.exit(1) // Error
  }
}

mongoose.Promise = global.Promise

console.log(`DemocracyOS - v3 core`)
console.log(`Seeding mongodb with init values.`)
console.log('================================================')
execute()
