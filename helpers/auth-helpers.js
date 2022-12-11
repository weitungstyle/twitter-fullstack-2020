// 使用者認證 isAuthenticated
const ensureAuthenticated = req => {
  return req.isAuthenticated()
}


module.exports = {
  ensureAuthenticated
}
