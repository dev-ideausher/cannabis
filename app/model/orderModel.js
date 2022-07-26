const mongoose = require('mongoose')
var Timezone = require("../helper/timezone.js")


const OrderDetailsSchema = new mongoose.Schema({
    order_no: { type: String },
    prefix: { type: String, default: 'CANNABIS' },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetails',
        autopopulate: true
    },
    line_total: {
        type: Number
    },
    shipping_cost: {
        type: Number
    },
    shipping_address_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AddressDetails',
        autopopulate: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetails',
        autopopulate: true
    },
    coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CouponsDetails',
        autopopulate: true
    },
    coupon_code: {
        type: String
    },
    discount_cost: {
        type: Number
    },
    discount: {
        type: Number
    },
    status: {
        type: Number,
        default: 1
    },
    payment_option: {
        type: String
    },
    payment_status: {
        type: Number,
        default: 1
    },
    payment_error: {
        type: String
    },
    delivery_message: {
        type: String
    },
    delivery_option: {
        type: String
    },
    date: {
        type: String
    },
    orderedDate: {
        type: Date
    },
    month: {
        type: Number
    },
    year: {
        type: Number
    },
    refund: { refund_id: { type: String }, status: { type: Number }, date: { type: Date } },
    deliveredDate: {
        type: Date
    },
    deliveryDate: {
        type: Date
    },
    is_active:{
        type: Boolean,
        default:true
    }
}, {
    timestamps: true,
    strict: true
})
var collectionName = 'orders'

OrderDetailsSchema.virtual('order_id').get(function () { return this._id })
OrderDetailsSchema.virtual('order_date').get(function () { return Timezone.changeFormat(this.date, 'YYYY-MM-DD') })
OrderDetailsSchema.virtual('order_time').get(function () { return Timezone.changeFormat(this.date, 'hh:mm a') })
OrderDetailsSchema.virtual('grand_total').get(function () { return (this.line_total + this.shipping_cost) - this.discount_cost })

OrderDetailsSchema.virtual('order_status').get(function () {
  return Orderstatus(this.status)
})

let Orderstatus = function(status) {
    switch (status) {
        case 0:
            return "Payment pending";
        case 1:
            return "Awaiting confirmation";
        case 2:
            return "Confirmed";
        case 3:
            return "Shipped";
        case 4:
            return "Out for delivery";
        case 5:
            return "Delivered";
        case 6:
            return "cancelled";
    }
}

OrderDetailsSchema.virtual('orderitems', {
    ref: 'OrderItemDetails',
    localField: '_id',
    foreignField: 'order'
});
OrderDetailsSchema.virtual('feedbacks', {
    ref: 'Ratings',
    localField: '_id',
    foreignField: 'order'
})
OrderDetailsSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v
        delete ret._id
        delete ret.id
        delete ret.invoice_no
        delete ret.prefix
        delete ret.updatedAt
        delete ret.total
    }
})
OrderDetailsSchema.plugin(require('mongoose-autopopulate'))
module.exports = mongoose.model('OrdersDetails', OrderDetailsSchema, collectionName)
