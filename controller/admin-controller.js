const bcrypt = require('bcryptjs')
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
  }
}

module.exports = adminController
