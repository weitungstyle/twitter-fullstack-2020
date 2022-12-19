const { User, Tweet, Reply, Like, Followship } = require('../models')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')

const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  //帳號密碼核對會在passport
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    // 使用req.flash會跳回signin
    // if (password !== checkPassword) req.flash('error_messages', '密碼不相符!ヽ(#`Д´)ﾉ')
    // if (name.length > 50) req.flash('error_messages', '字數超出上限ヽ(#`Д´)ﾉ')
    if (password !== checkPassword) throw new Error('密碼不相符!ヽ(#`Д´)ﾉ')
    if (name.length > 50) throw new Error('字數超出上限ヽ(#`Д´)ﾉ')
    //const { Op } = require('sequelize')
    //使用sequelize operator or，來選擇搜尋兩樣東西，我應該有成功?
    return Promise.all([User.findOne({ where: { email } }), User.findOne({ where: { account } })])
      .then(([email, account]) => {
        if (email) throw new Error('Email already exists!')
        if (account) throw new Error('account already exists!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        User.create({
          account, name, email, password: hash
        })
      })
      .then(() => {
        req.flash('success_messages', '帳號註冊成功!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUserTweets: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([
      User.findById(userId),
      Tweet.find({ where: { userId } }),
      Followship.find({ where: { userId } })
    ])
      .then(([user, tweets, followships]) => {
        console.log(user)
      })
  },
  getUserReplies: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([
      User.findById(userId),
      Reply.find({ where: { userId } }),
      Followship.find({ where: { userId } })
    ])
      .then(([user, replies, followships]) => {
        console.log(user)
      })
  },
  getUserLikes: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([
      User.findById(userId),
      Like.find({ where: { userId } }),
      Followship.find({ where: { userId } })
    ])
      .then(([user, likes, followships]) => {
        console.log(user)
      })
  },
  // getUserPage: (req, res, next) => {
  //   res.render('personal-page')
  // }
  getSetting: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    const currentUserId = helpers.getUser(req) && helpers.getUser(req).id

    if (currentUserId !== Number(req.params.id)) {
      req.flash('error_messages', '無法修改他人資料！')
      return res.redirect(`/users/${currentUserId}/setting`)
    }

    return User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        res.render('setting')
      })
      .catch(err => next(err))
  },
  putSetting: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    const { account, name, email, password, checkPassword } = req.body

    if (!account || !name || !email || !password || !checkPassword) throw new Error('所有欄位都是必填！')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不相符！')
    if (name.length > 50) throw new Error('字數超出上限！')

    return Promise.all([
      User.findByPk(currentUser.id),
      User.findOne({ where: { email }, raw: true }),
      User.findOne({ where: { account }, raw: true })
    ])
      .then(([user, findEmail, findAccount]) => {
        if (findAccount) {
          if (findAccount.id !== user.id) throw new Error('account 已重複註冊！')
        }

        if (findEmail) {
          if (findEmail.id !== user.id) throw new Error('email 已重複註冊！')
        }

        return bcrypt.hash(password, 10)
          .then(hash => {
            return user.update({
              account,
              name,
              email,
              password: hash
            })
          })
      })
      .then(() => {
        req.flash('success_messages', '個人資料修改成功！')
        return res.redirect(`/users/${currentUser.id}/tweets`)
      })
      .catch(err => next(err))
    }
}



module.exports = userController
