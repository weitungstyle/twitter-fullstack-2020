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

//error handleler
const { generalErrorHandler } = require('../middleware/error-handler')


router.use('/admin', admin)

// 要在 router 部分裡面  新增 authenticated (使用者認證)

//signin
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

//logout
router.get('/logout', userController.logout)


//register
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

//users

//
// router.get('/tweets', userController.getFollowers)

//tweets
// 測試用 router.get('/tweets', userController.getTweets)
router.get('/tweets', authenticated, tweetController.getTweet)
router.post('/tweets', authenticated, tweetController.postTweet)

//getTopUsers
router.post('/tweets', authenticated, userController.getTopUsers)
//followship
router.post('/followship/:id', authenticated, userController.addFollowing)
router.delete('/followship/:id', authenticated, userController.removeFollowing)


// //fallback
router.get('/', (req, res) => { res.redirect('/tweets') })
router.use('/', generalErrorHandler)

module.exports = router
