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

const { SETUP } = require('./config')
const log = require('./services/logger')
const config = require('./services/mongoose')
const mongoose = require('./services/mongoose')
const Community = require('./models/community')
const dbCommunity = require('./db-api/community')
const DocumentType = require('./models/documentType')
const dbDocumentType = require('./db-api/documentType')
const DocumentTypeVersion = require('./models/documentTypeVersion')
// const dbDocumentTypeVersion = require('./db-api/documentTypeVersion')
const { NODE_ENV } = process.env

const main = async () => {
  try {
    console.log('================================================')
    console.log(`Starting server [${NODE_ENV}] with the following config`)
    console.log('=================s===============================')
    console.log(SETUP)
    console.log('================================================')
    log.info('Cleaning database models for setup...')
    await Community.remove({})
    log.info('Communities were cleaned')
    await DocumentType.remove({})
    log.info('DocumentTypes were cleaned')
    await DocumentTypeVersion.remove({})
    log.info('DocumentTypes versions were cleaned')
    console.log('================================================')
    log.info('Creating community...')
    await dbCommunity.create({
      name: SETUP.COMMUNITY_NAME,
      mainColor: SETUP.COMMUNITY_COLOR,
      logo: null,
      user: null,
      initialized: true
    })
    log.info('Creating document Type...')
    await dbDocumentType.create({
      name: SETUP.DOCUMENT_TYPE_NAME,
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
    log.info('Setup finished!')
    process.exit(0)
  } catch (err) {
    log.error('An error occurred, setup stopped unexpectly')
    log.error(err)
  }
}

main()