const { User, Tweet, Reply, Like, Followship } = require('../models')
const sequelize = require('sequelize')
const helpers = require('../_helpers')

const apiController = {
  getUserAPI: (req, res, next) => {
    const loginUserId = helpers.getUser(req).id
    const editUserId = req.params.id
    // if (editUserId !== loginUserId) {
    //   req.flash('error_messages', "You can't edit other's profile!")
    //   return res.redirect(200, 'back')
    // }
    return User.findByPk(editUserId, {
      attributes: ['name', 'introduction', 'avatar', 'cover']
    })
      .then(user => res.json(user.toJSON()))
      .catch(err => next(err))
  },
  postUserAPI: (req, res, next) => {
    const loginUserId = helpers.getUser(req).id
    const editUserId = req.params.id
    // if (editUserId !== loginUserId) throw new Error("You can't edit other's profile!")
    console.log('complete')
    res.redirect('back')
  }
}

module.exports = apiController
