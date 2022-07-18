const mongoose = require('mongoose')

const WalletSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetails'
    },
    amount:{
        type: Number
    },
    symbol:{
        type: String
    },
    isActive: {
        type: Boolean
    }
},{
    timestamps: true,
    strict: true
})

WalletSchema.virtual('wallet_id').get(function() { return this._id })
WalletSchema.set('toJSON', {
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

WalletSchema.plugin(require('mongoose-autopopulate'))
module.exports = mongoose.model('WalletDetails', WalletSchema, 'WalletDetails')
