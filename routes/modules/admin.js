// 載入使用者認證 middleware/auth.js
const express = require('express')
const router = express.Router()
const { authenticatedAdmin } = require('../../middleware/auth')
const adminController = require('../../controller/admin-controller')



// 要在 router 部分裡面  新增 authenticatedAdmin (管理者認證)

router.get('/signin', adminController.signInPage)
router.get('/tweets', adminController.getTweets)
router.get('/users', adminController.getUsers)

module.exports = router