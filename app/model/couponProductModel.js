const mongoose = require('mongoose')

const couponProductDetailsSchema = new mongoose.Schema({
    coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CouponsDetails'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductDetails',
        autopopulate: true
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    strict: true
})

couponProductDetailsSchema.virtual('coupon_id').get(function() { return this.coupon; });

couponProductDetailsSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret._id;
        delete ret.id;
        delete ret.updatedAt;
        delete ret.createdAt;
    },
});
var collectionName = 'coupon_product'

couponProductDetailsSchema.plugin(require('mongoose-autopopulate'))
module.exports = mongoose.model('CouponProductDetails', couponProductDetailsSchema, collectionName)