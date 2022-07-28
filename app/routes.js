const userRouter = require('./routes/users')
const addressRouter = require('./routes/address')
const productRouter = require('./routes/product')
const categoryRouter = require('./routes/category')
const orderRouter = require('./routes/order')
const fileUploadRouter = require('./routes/fileupload')
const couponRouter = require('./routes/coupon')
const walletRouter = require('./routes/wallet')

module.exports = function(app) {
    app.use('/api/v1/user', userRouter)
    app.use('/api/v1/address', addressRouter)
    app.use('/api/v1/product', productRouter)
    app.use('/api/v1/category', categoryRouter)
    app.use('/api/v1/order', orderRouter)
    app.use('/api/v1/upload', fileUploadRouter)
    app.use('/api/v1/coupon', couponRouter)
    app.use('/api/v1/wallet', walletRouter)
}