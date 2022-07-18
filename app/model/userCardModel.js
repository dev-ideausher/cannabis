const mongoose = require('mongoose')

const userCardSchema = new mongoose.Schema({
    card_holder_name:{
        type: String,
    },
    card_number:{
        type: String
    },
    isActive: {
        type: Boolean
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
