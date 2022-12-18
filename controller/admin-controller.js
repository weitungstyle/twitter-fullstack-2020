const { User, Tweet } = require('../models')
const { getUser } = require('../_helpers')

const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res, next) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  logout: (req, res, next) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      order: [['createdAt', 'DESC']],
      nest: true,
      raw: true
    })
      .then(tweets => {
        res.render('admin/tweets',)
      })
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      where: { role: 'user' },
      order: [['createdAt', 'DESC']],
      nest: true,
      raw: true
    })
      .then(users => {
        console.log(users)
        res.render('admin/users', { users })
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    const tweetId = req.params.id
    return Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) throw new Error("The tweet does not exist!")
        return tweet.destroy()
      })
      .then(() => res.redirect('/admin/tweets'))
      .catch(err => next(err))
  }
}

module.exports = adminController
