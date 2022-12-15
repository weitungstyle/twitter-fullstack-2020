// 要在 router 部分裡面  新增 authenticated (使用者認證)
const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

// 載入使用者認證 middleware/auth.js
const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

// 載入controller
const userController = require('../controller/user-controller')
const tweetController = require('../controller/tweet-controller')

//register
router.get('/signin', userController.signInPage)
// router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

//logout
router.get('/logout', userController.logout)

// Tweets
// router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets', tweetController.getTweet)

//register
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

//fallback
router.get('/', (req, res) => { res.redirect('/tweets') })
router.use('/', generalErrorHandler)

module.exports = router
