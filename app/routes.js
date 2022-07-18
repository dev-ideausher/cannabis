const userRouter = require('./routes/users')

module.exports = function(app) {
    app.use('/api/v1/user', userRouter)

}