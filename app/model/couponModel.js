const mongoose = require('mongoose')
var Timezone = require("../helper/timezone")

const couponsDetailsSchema = new mongoose.Schema({
    coupon_code: {
        type: String
    },
    discount_type: {
        type: String,
        enum: ['FIXED', 'PERCENTAGE', 'AMOUNT'],
        default: 'FIXED'
    },
    start_date: {
        type: Date
    },
    expire_date: {
        type: Date
    },
    amount: {
        type: Number
    },
    is_active: {
        type: Boolean,
        default: true
    },
    max_use_per_person: {
        type: Number
    },
    max_global_usage: {
        type: Number
    },
    min_cart_value: {
        type: Number
    },
    max_discount: {
        type: Number
    },
    is_new_customer: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['PRODUCT', 'DELIVERY', 'USER', 'GLOBAL'],
        default: 'PRODUCT'
    }
}, {
    timestamps: true,
    strict: true
})

couponsDetailsSchema.virtual('coupon_id').get(function() { return this._id; });
couponsDetailsSchema.virtual('expire_status').get(function() {
    const expiredate = parseInt(Timezone.timestamp(this.expire_date));
    const currenttime = Timezone.Currenttimestamp();
    if (currenttime > expiredate) { return true; } else { return false; }
});
couponsDetailsSchema.virtual('start_status').get(function() {
    const startdate = parseInt(Timezone.timestamp(this.start_date));
    const currenttime = Timezone.Currenttimestamp();
    if (startdate < currenttime) { return true; } else { return false; }
});

couponsDetailsSchema.virtual('products', {
    ref: 'CouponProductDetails',
    localField: '_id',
    foreignField: 'coupon'
});

couponsDetailsSchema.virtual('users', {
    ref: 'CustomerGroupDetails',
    localField: '_id',
    foreignField: 'coupon'
});

couponsDetailsSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret._id;
        delete ret.id;
        delete ret.updatedAt;
        delete ret.createdAt;
    },
});
var collectionName = 'coupons'
module.exports = mongoose.model('CouponsDetails', couponsDetailsSchema, collectionName)