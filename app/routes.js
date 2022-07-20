const userRouter = require('./routes/users')
const addressRouter = require('./routes/address')
const productRouter = require('./routes/product')
const categoryRouter = require('./routes/category')

module.exports = function(app) {
    app.use('/api/v1/user', userRouter)
    app.use('/api/v1/address', addressRouter)
    app.use('/api/v1/product', productRouter)
    app.use('/api/v1/category', categoryRouter)

}