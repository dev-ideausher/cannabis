const mongoose = require('mongoose')

const driverOrdersSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DriverDetails'
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrdersDetails'
    },
    order_total: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        default: 0
    },
    order_type: {
        type: String,
        enum: ['order', 'return', 'replacement'],
        default: 'order'
    },
    payment_type: {
        type: String,
        enum: ['online'],
        default: 'online'
    }
}, {
    timestamps: true,
    strict: true
})

const collectionName = 'driver_orders'

driverOrdersSchema.virtual('driver_order_id').get(function() { return this._id; });
driverOrdersSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v
        delete ret._id
    }
})

driverOrdersSchema.plugin(require('mongoose-autopopulate'))
module.exports = mongoose.model('DriverOrders', driverOrdersSchema, collectionName)