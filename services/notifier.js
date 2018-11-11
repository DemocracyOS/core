const axios = require('axios')
const { NOTIFIER_URL } = require('../config')
const log = require('./logger')

const http = axios.create()

exports.sendCommentNotification = async ({ type, comment, participant, accountable }) => {
  let payload = {
    'type': type,
    'info': {
      'to': participant.email,
      'document': {
        'participant': participant,
        'accountable': accountable,
        'comment': comment
      }
    }
  }
  http.post(NOTIFIER_URL, payload).then((response) => {
    log.info(response.data.message, {
      type: type,
      to: email
    })
  }).catch((error) => {
    log.error('ERROR Sending Email', {
      type: type,
      to: email,
      meta: error.message
    })
  })
}
