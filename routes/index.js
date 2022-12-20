const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const userController = require('../controller/user-controller')
const tweetController = require('../controller/tweet-controller')
// 載入使用者認證 middleware/auth.js
const { authenticated } = require('../middleware/auth')
//error handleler
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)

//signin
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

//logout
router.get('/logout', userController.logout)

//register
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

//tweets
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)

//users
router.get('/users/:id/tweets', authenticated, userController.getTweet)
//replies
router.get('/tweets/:id', authenticated, tweetController.getReplies)

//followship
router.post('/followships/:id', authenticated, userController.addFollowing)
router.delete('/followships/:id', authenticated, userController.removeFollowing)

// router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
// router.get('/users/:id/replies', authenticated, userController.getUserReplies)
// router.get('/users/:id/likes', authenticated, userController.getUserLikes)

// //fallback
router.get('/', (req, res) => { res.redirect('/tweets') })
router.use('/', generalErrorHandler)

module.exports = router
