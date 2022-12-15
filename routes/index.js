const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')

// 載入controller
const userController = require('../controller/user-controller')
const tweetController = require('../controller/tweet-controller')
const adminController = require('../controller/admin-controller')

// 載入使用者認證 middleware/auth.js
const { authenticated } = require('../middleware/auth')
const { authenticatedAdmin } = require('../middleware/auth')
//error handleler
const { generalErrorHandler } = require('../middleware/error-handler')

router.get('/admin/signin', adminController.signInPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
router.get('/admin/logout', adminController.logout)
router.use('/admin', authenticatedAdmin, admin)

// 要在 router 部分裡面  新增 authenticated (使用者認證)

//signin
router.get('/signin', userController.signInPage)

//user個人首頁
router.get('/users/:id', userController.getUserPage)


// Tweets
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets/:id', tweetController.getTweet)


//fallback
router.get('/', (req, res) => res.redirect('/signin'))
router.use('/', generalErrorHandler)

module.exports = router
