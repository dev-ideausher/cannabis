const mongoose = require('mongoose')

const userCardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetails'
    },
    card_holder_name:{
        type: Object,
    },
    card_number:{
        type: Object
    },
    cvc:{
        type: Object
    },
    card_type:{
        type: String
    },
    expiryDate: {
        type:Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true,
    strict: true
})

userCardSchema.virtual('user_card_id').get(function() { return this._id })
userCardSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v
        delete ret._id
        delete ret.id
        delete ret.user
        delete ret.updatedAt
        delete ret.createdAt
    },
})

module.exports = mongoose.model('UserCard', userCardSchema, 'UserCard')
