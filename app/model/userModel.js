const mongoose = require('mongoose')
const config = require('../helper/config').get(process.env.NODE_ENV)

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
    dob:{
        type:Date
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
    },
    is_referral_bonus_Sent:{
        type: Boolean
    },
    otp:{
        type: Number
    }
}, {
    timestamps: true,
    strict: true
})

userSchema.virtual('user_id').get(function() { return this._id; })
userSchema.virtual('front_id').get(function() { if(this.frontId != undefined){return config.BaseUrl+this.frontId} else {return ''} })
userSchema.virtual('back_id').get(function() { if(this.backId != undefined){return config.BaseUrl+this.backId} else {return ''} })

userSchema.virtual('address', {
    ref: 'AddressDetails',
    localField: '_id',
    foreignField: 'user'
})

userSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v
        delete ret._id
        delete ret.id
        delete ret.updatedAt
        delete ret.createdAt
    }
})
module.exports = mongoose.model('UserDetails', userSchema, 'UserDetails')