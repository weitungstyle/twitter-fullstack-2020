const { User, Tweet, Reply, Like, Followship } = require('../models/user')

const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  getUserPage: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Tweet, include: User },
        { model: Reply, include: User },
        { model: Like, include: User },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(user => {
        if (!user) throw new Error("User does not exist.")
      })
      .then(user => {
        const isFollowed = user.Followings.some(f => f.id === req.user.id)
        res.render('user', { user: user.toJSON(), isFollowed })
      })
      .catch(err => next(err))
  }
}


module.exports = userController
