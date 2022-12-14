const tweet = require('./fake.json')

const tweetController = {
  getTweet: (req, res) => {
    res.render('tweet')
  }
}
module.exports = tweetController
