// 載入使用者認證 middleware/auth.js
const { authenticated } = require('../middleware/auth')


// 要在 router 部分裡面  新增 authenticated (使用者認證)
const express = require('express')
const router = express.Router()

// 載入使用者認證 middleware/auth.js
const { authenticated } = require('../middleware/auth')

// 載入controller
const userController = require('../controller/user-controller')
const tweetController = require('../controller/tweet-controller')


//register
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
//signin
router.get('/signin', userController.signInPage)

// //fallback
router.get('/', (req, res) => { res.redirect('/signin') })
router.use('/', generalErrorHandler)

router.use('/', generalErrorHandler)
module.exports = router
