const md5 = require('md5')
exports.checkAuthToken = function (authToken, values) {
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  if (authToken === md5(values)) {
    return true
  }
  return false
}
