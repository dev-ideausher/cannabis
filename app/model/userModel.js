const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new mongoose.Schema({
    mobile: {
        type: String
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role'
    },
    is_otp_verified: {
        type: Boolean
    },
    is_active: {
        type: Boolean
    },
    login_type: {
        type: String,
        enum: ['OTP'],
        default: 'OTP'
    },
    referral_code: {
        type: String
    },
    frontId: {
        type: String
    },
    backId: {
        type: String
    }
}, {
    timestamps: true,
    strict: true
})
userDetailsSchema.virtual('user_id').get(function() { return this._id; })
userDetailsSchema.virtual('frontId').get(function() { return config.BaseUrl+this.frontId })
userDetailsSchema.virtual('backId').get(function() { return config.BaseUrl+this.backId })

userDetailsSchema.virtual('address', {
    ref: 'AddressDetails',
    localField: '_id',
    foreignField: 'user'
});
userDetailsSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v
        delete ret._id
        delete ret.id
        delete ret.updatedAt
        delete ret.createdAt
    },
});
module.exports = mongoose.model('UserDetails', userDetailsSchema, 'UserDetails')