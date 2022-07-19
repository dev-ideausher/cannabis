const userRouter = require('./routes/users')
const addressRouter = require('./routes/address')

module.exports = function(app) {
    app.use('/api/v1/user', userRouter)
    app.use('/api/v1/address', addressRouter)

}