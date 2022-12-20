const { User, Tweet, Reply, Like, Followship } = require('../models')
const bcrypt = require('bcryptjs')
const { getUser } = require('../_helpers')

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
    //使用sequelize operator or，來選擇搜尋兩樣東西。
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
  
  //註冊修改頁面
  getSetting: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.render('setting', { user })
      })
      .catch(err => next(err))
  },
  //註冊修改頁面驗證
  putSetting: async (req, res, next) => {
    try {
      const { editAccount, editName, editEmail, editPassword, editCheckPassword } = req.body
      const { id, account, email } = getUser(req)

      if (editPassword !== editCheckPassword) throw new Error('密碼不相符!ヽ(#`Д´)ﾉ')
      if (editName.length > 50) throw new Error('字數超出上限ヽ(#`Д´)ﾉ，字數要在50字以內')
      if (editAccount === account) {
        const exitAccount = await User.findOne({ where: { account } })
        if (exitAccount) throw new Error(' 帳號已重複註冊！')
      }
      if (editEmail === email) {
        const exitEmail = await User.findOne({ where: { email } })
        if (exitEmail) throw new Error('Email已重複註冊！')
      }
      const editUser = await User.findByPk(id)
      await editUser.update({
        account: editAccount,
        name: editName,
        email: editEmail,
        password: await bcrypt.hash(editPassword, 10)
      })
      req.flash('success_messages', '成功更新！')
      res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
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
      User.findByPk(userId),
      Reply.findAll({ where: { UserId: userId } }),
      Followship.findAll({ where: { UserId: userId } })
    ])
      .then(([user, replies, followships]) => {
        // console.log(user)
        res.render('replies', { user, replies, followships })
      })
      .catch(err => next(err))
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
  getUserPage: (req, res, next) => {
    res.render('personal-page')
  },
  //我用來測試畫面的
  getTweets: (req, res) => {
    res.render('tweets')
  },
  getSetting: (req, res) => {
    res.render('setting')
  },
  getPerson: (req, res) => {
    res.render('personal-page')
  },
  reply: (req, res) => {
    res.render('replies')
  },
  getFollower: (req, res) => {
    res.render('followings')
  },
  getTweet: (req, res) => {
    res.render('tweet')
  }
}



module.exports = userController
