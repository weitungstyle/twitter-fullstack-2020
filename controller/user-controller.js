const { User, Tweet, Reply, Like, Followship } = require('../models')

const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  getUserPage: (req, res, next) => {
    User.findByPk(req.params.id, {
      include: [
        { model: Tweet, include: User },
        { model: Reply, include: User },
        { model: Like, include: User },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ],
      raw: true,
      nest: true
    })
      .then(user => {
        if (!user) throw new Error("User does not exist.")
      })
      .then(user => {
        console.log(user)
        //        const isFollowed = user.Followings.some(f => f.id === req.user.id)
        res.render('user', { user })
      })
      .catch(err => next(err))
  }
}


module.exports = userController
