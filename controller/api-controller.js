const { User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const helpers = require('../_helpers')

const apiController = {
  getUserAPI: (req, res, next) => {
    const loginUserId = Number(helpers.getUser(req).id)
    const editUserId = Number(req.params.id)
    if (editUserId !== loginUserId) {
      return res.json({ status: 'error', messages: "You can't edit other's profile!" })
    }
    return User.findByPk(editUserId, {
      attributes: ['name', 'introduction', 'avatar', 'cover']
    })
      .then(user => res.json(user.toJSON()))
      .catch(err => next(err))
  },
  postUserAPI: (req, res, next) => {
    const loginUserId = Number(helpers.getUser(req).id)
    const editUserId = Number(req.params.id)
    const { name, introduction } = req.body
    const { files } = req
    if (editUserId !== loginUserId) throw new Error("You can't edit other's profile!")
    if (!name.trim()) throw new Error('User name is required!')
    return Promise.all([
      User.findByPk(editUserId),
      imgurFileHandler(files?.avatar && files.avatar[0]),
      imgurFileHandler(files?.coverImage && files.coverImage[0])
    ])
      .then(([user, avatar, imageCover]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          name,
          introduction,
          avatar: avatar || user.avatar,
          cover: imageCover || user.cover,
        })
          .then(() => res.redirect(200, 'back'))
          .catch(err => next(err))
      })
  }
}

module.exports = apiController
