// 後續做到 User, Reply, Like 記得加進來
const { Tweet, User } = require('../models')
const { getUser } = require('../_helpers')
const tweet = require('./fake.json').results

const tweetController = {
  getTweet: (req, res) => {
    Tweet.findAll({ order: [['createdAt', 'DESC']], include: User, nest: true, raw: true })
      .then(tweet => res.render('tweets', { tweet }))
  },
  postTweet: (req, res, next) => {
    const { description } = req.body // 前端傳入餐廳以及評論內容
    const UserId = getUser(req).id // 使用者(登入)id
    if (!description) throw new Error('Tweet text is required!')// 檢測輸入內容是否為空
    return Tweet.create({ UserId, description })
      .then(() => res.redirect('/tweets'))
      .catch(err => next(err))

    // const UserId = helpers.getUser(req).id
    // const description = req.body.description
    // if (!description.trim()) {
    //   req.flash('error_messages', '推文不可空白')
    //   res.redirect('back')
    // } else if (description.length > 140) {
    //   req.flash('error_messages', '推文不得超過 140 個字')
    //   res.redirect('back')
    // }
  },
}


module.exports = tweetController
