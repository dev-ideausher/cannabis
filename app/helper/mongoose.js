const mongoose = require('mongoose')
const config = require('./config').get(process.env.NODE_ENV)

mongoose.Promise = global.Promise

mongoose.connect(config.database.url, { useNewUrlParser: true, socketTimeoutMS: 30000, keepAlive: true })
  .then(() => console.log('Database Connected'))
  .catch((error) => console.log(error))
module.exports = mongoose
