const { User } = require('../models')
const bcrypt = require('bcryptjs')

const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  //帳號密碼核對會在passport
  signIn: (req, res, next) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    const errors = []
    if (password !== checkPassword) errors.push({ message: '密碼不相符!ヽ(#`Д´)ﾉ' })
    if (name.length > 50) errors.push({ message: '字數超出上限ヽ(#`Д´)ﾉ' })
    if (errors.length) {
      return res.render('signup', { errors, account, name, email, password })
    }
    User.findOne({ where: { email } })
      // .then(user => {
      //   if (user) {
      //     req.flash('warning_msg', 'email已被註冊 ヽ(#`Д´)ﾉ')
      //     return res.render('signup', { account, name, email, password })
      //   }
      //   return bcrypt
      //     .genSalt(10)
      //     .then(salt => bcrypt.hash(password, salt))
      //     .then(hash => User.create({
      //       name, email, password: hash
      //     }))
      //     .then(() => res.redirect('/signin'))
      //     .catch(err => console.log(err))
      // })

      .then(user => {
        const error2 = []
        // if (user) {
        //   req.flash('error_messages', 'email已被註冊 ヽ(#`Д´)ﾉ')
        //   return res.render('signup', { errors, account, name, email, password })
        // }
        // if (user.email) throw new Error('no')
        // // if (user) errors.push({ message: 'Email不可重複!ヽ(#`Д´)ﾉ' })
        // if (user.account) errors.push({ message: '帳號名稱不可重複!ヽ(#`Д´)ﾉ' })
        // return bcrypt.hash(password, 10)
        // if (user.email) {
        //   req.flash('error_messages', 'email已被註冊 ヽ(#`Д´)ﾉ')
        //   return res.render('signup', { errors, account, name, email, password })
        // }
        // if (user.account) req.flash('error_messages', 'noヽ(#`Д´)ﾉ')
        if (user) {
          if (user.email) error2.push({ message: 'Email不可重複!ヽ(#`Д´)ﾉ' })
          if (user.account) error2.push({ message: 'email已被註冊(#`Д´)ﾉ' })
          if (errors.length) {
            return res.render('signup', { error2, account, name, email, password })
          }
        }

        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        User.create({
          account, name, email, password: hash
        })
      })
      .then(() => {
        req.flash('帳號註冊成功!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getTweets: (req, res) => {
    res.render('following')
  }
}


module.exports = userController