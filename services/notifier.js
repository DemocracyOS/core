const axios = require('axios')
const log = require('./logger')

const http = axios.create({
  baseURL: 'http://localhost:4000'
})

exports.sendLikeNotification = async (email, comment, author, title) => {
  let payload = {
    'type': 'comment-liked',
    'info': {
      'to': email,
      'document': {
        'title': `A ${author} le gustó tu comentario`,
        'author': `El autor del proyecto "${title}" le gusto tu comentario`,
        'comment': `Este fue el comentario que le gustó: ${comment}`
      }
    }
  }
  http.post('/api/sendemail', payload).then((response) => {
    log.info(response.data.message, {
      type: 'comment-liked',
      to: email })
  }).catch((error) => {
    log.error('ERROR Sending Email', {
      type: 'comment-liked',
      to: email,
      meta: error.message })
  })
}
