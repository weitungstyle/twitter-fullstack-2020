const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')

// 載入controller
const userController = require('../controller/user-controller')
const tweetController = require('../controller/tweet-controller')


// 載入使用者認證 middleware/auth.js
const { authenticated } = require('../middleware/auth')
const { authenticatedAdmin } = require('../middleware/auth')
// error handleler
const { generalErrorHandler } = require('../middleware/error-handler')
router.use('/admin', admin)



//register
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)


//logout
router.get('/logout', userController.logout)

// Tweets
// router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets', tweetController.getTweet)

//register
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
//followings
// router.get('/users/followings', userController.getFollower)

//user setting (使用者帳戶設定)
// router.get('/users/:id/setting', userController.getSetting)
// router.put('/users/:id/setting', userController.putSetting)

// router.get('/users/', userController.getUserPage)
//users
// router.get('/users/:id/tweets', userController.getUserTweets)
// router.get('/users/:id/replies', userController.getUserReplies)
// router.get('/users/:id/likes', userController.getUserLikes)


//personal
// router.get('/users/tweets', userController.getPerson)
//使用者帳戶資訊，驗證不要忘記阻擋非user
router.get('/users/:id/setting', userController.getSetting)
router.put('/users/:id/setting', userController.putSetting)
//replies
// router.get('/users/replies', userController.reply)
//tweets
// router.get('/tweets', userController.getTweets)
// router.get('/tweet', userController.getTweet)
router.post('/tweets', tweetController.postTweet)

// //fallback
router.get('/', (req, res) => { res.redirect('/tweets') })
// router.use('/', generalErrorHandler)

module.exports = router
