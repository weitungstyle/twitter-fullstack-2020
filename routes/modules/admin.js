const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const adminController = require('../../controller/admin-controller')

router.get('/admin/signin', adminController.signInPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
router.get('/admin/logout', adminController.logout)

// 要在 router 部分裡面  新增 authenticatedAdmin (管理者認證)

module.exports = router
