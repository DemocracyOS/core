const express = require('express')
const status = require('http-status')
const ReactionInstance = require('../db-api/reaction-instances')
const ReactionRule = require('../db-api/reaction-rules')
const ReactionVote = require('../db-api/reaction-votes')
const router = express.Router()
// const log = require('../services/logger')
const { isLoggedIn } = require('../services/users')

const dataForLike = function (instance, user) {
  let userParticipants = []
  instance.results.forEach((vote) => {
    if (!vote.meta.deleted) userParticipants.push(vote.userId)
  })
  let userVote = null
  if (user !== undefined) {
    userVote = instance.results.find((vote) => {
      return vote.userId._id.toString() === user.id.toString()
    })
  }
  // Count the votes that are not deleted
  let countVotes = instance.results.reduce((accumulator, currentValue) => {
    if (!currentValue.meta.deleted) {
      return accumulator + 1
    }
    return accumulator
  }, 0)
  let data = {
    id: instance._id,
    title: instance.title,
    instruction: instance.instruction,
    reactionRule: instance.reactionId,
    participants: userParticipants,
    userVote: userVote,
    data: {
      name: 'LIKE',
      value: countVotes
      // value: instance.results.length
    }
  }
  return data
}

const dataForChoose = function (instance) {
  let data = null
  let options = new Set()
  let frequency = []
  let instanceResults = []
  // let userParticipants = instance.results.map((x) => x.userId)
  let userParticipants = instance.results
  instance.results.forEach((vote) => {
    options.add(vote.value)
    frequency[vote.value] = (frequency[vote.value] ? frequency[vote.value] : 0) + 1
  })
  options.forEach((option) => {
    instanceResults.push({
      option: option,
      value: frequency[option]
    })
  })
  data = {
    id: instance._id,
    title: instance.title,
    instruction: instance.instruction,
    reactionRule: instance.reactionId,
    data: instanceResults,
    participants: userParticipants
  }
  return data
}

const createLikeVote = function (userId) {
  return {
    userId: userId,
    meta: {
      timesVoted: 1,
      deleted: false
    }
  }
}

// GET reaction-instances
router.get('/posts/:id/results',
  async (req, res, next) => {
    try {
      const instances = await ReactionInstance.listResultsByPost({ id: req.params.id })
      let dataArray = []
      instances.forEach((instance) => {
        let dataInstance = {}

        switch (instance.reactionId.method) {
          case 'LIKE':
            dataInstance = dataForLike(instance, req.user)
            break
          // This is for future implementations..
          // Depending of the type of rule, it needs to process data in a different way
          case 'VOTE':
            dataInstance = dataForChoose(instance)
            break
          default:
            break
        }
        dataArray.push(dataInstance)
      })

      res.status(status.OK).json(dataArray)
    } catch (err) {
      next(err)
    }
  })

// GET reaction-instances
router.get('/:id/result',
  async (req, res, next) => {
    try {
      const instance = await ReactionInstance.getResult({ id: req.params.id })
      let data = {}
      switch (instance.reactionId.method) {
        case 'LIKE':
          data = dataForLike(instance, req.user)
          break
        // This is for future implementations..
        // Depending of the type of rule, it needs to process data in a different way
        case 'VOTE':
          data = dataForChoose(instance)
          break
        default:
          break
      }

      res.status(status.OK).json(data)
    } catch (err) {
      next(err)
    }
  })

router.post('/:idInstance/vote',
  isLoggedIn,
  async (req, res, next) => {
    try {
      let reactionInstance = await ReactionInstance.get(req.params.idInstance)
      let reactionRule = await ReactionRule.get('' + reactionInstance.reactionId)
      // Check if the closing date is > than NOW
      if (reactionRule.closingDate !== undefined && reactionRule.closingDate !== null && (new Date() - new Date(reactionRule.closingDate) > 0)) {
        res.status(status.FORBIDDEN).send('The voting has closed')
        return
      }

      // Check if the user has voted before
      let reactionInstanceResults = await ReactionInstance.getResult({ id: req.params.idInstance })
      let vote = reactionInstanceResults.results.find((x) => {
        return x.userId.id.toString() === req.user.id.toString()
      })
      if (vote === undefined) {
        let voteData = null
        switch (reactionRule.method) {
          case 'LIKE':
            voteData = createLikeVote(req.user.id)
            break
          default:
            res.status(status.FORBIDDEN).send('Reaction Method not found!')
            return
        }
        const savedVote = await ReactionVote.create(voteData)
        reactionInstance.results.push(savedVote._id)
        await ReactionInstance.update({ id: req.params.idInstance, reactionInstance: reactionInstance })
        res.status(status.CREATED).json(savedVote)
        return
      } else {
        // Get the vote
        const reactionVote = await ReactionVote.get(vote._id)
        if (reactionVote.meta.timesVoted >= reactionRule.limit) {
          res.status(status.FORBIDDEN).json(reactionVote)
          return
        }
        let dataChange = { meta: reactionVote.meta }
        // Was the vote deleted?
        if (dataChange.meta.deleted) {
          // It was. Now re-enable it and add one more vote.
          dataChange.meta.timesVoted += 1
        }
        // Update the deleted state
        dataChange.meta.deleted = !dataChange.meta.deleted
        // Now save it to the DB
        const savedVote = await ReactionVote.update({ id: reactionVote._id, reactionVote: dataChange })
        // Return response with the updated value
        res.status(status.OK).json(savedVote)
        return
      }
    } catch (err) {
      next(err)
    }
  })

module.exports = router
