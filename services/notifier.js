const axios = require('axios')
const { NOTIFIER_URL } = require('../config')
const log = require('./logger')

const http = axios.create()

exports.sendLikeNotification = async (email, comment, author, title) => {
  let payload = {
    'type': 'comment-liked',
    'info': {
      'to': email,
      'document': {
        'title': title,
        'author': author,
        'comment': comment
      }
    }
  }
  http.post(NOTIFIER_URL, payload).then((response) => {
    log.info(response.data.message, {
      type: 'comment-liked',
      to: email
    })
  }).catch((error) => {
    log.error('ERROR Sending Email', {
      type: 'comment-liked',
      to: email,
      meta: error.message
    })
  })
}

exports.sendResolvedNotification = async (email, comment, author, title) => {
  let payload = {
    'type': 'comment-resolved',
    'info': {
      'to': email,
      'document': {
        'title': title,
        'author': author,
        'comment': comment
      }
    }
  }
  http.post(NOTIFIER_URL, payload).then((response) => {
    log.info(response.data.message, {
      type: 'comment-resolved',
      to: email
    })
  }).catch((error) => {
    log.error('ERROR Sending Email', {
      type: 'comment-resolved',
      to: email,
      meta: error.message
    })
  })
}

exports.sendDocumentEdited = (comments, author, title) => {
  comments.forEach((comment) => {
    let payload = {
      'type': 'document-edited',
      'info': {
        'to': comment.user.email,
        'document': {
          'title': title,
          'author': author,
          'comment': comment.content
        }
      }
    }
    http.post(NOTIFIER_URL, payload).then((response) => {
      log.info(response.data.message, {
        type: 'document-edited',
        to: comment.user.email
      })
    }).catch((error) => {
      log.error('ERROR Sending Email', {
        type: 'document-edited',
        to: comment.user.email,
        meta: error.message
      })
    })
  })
}
