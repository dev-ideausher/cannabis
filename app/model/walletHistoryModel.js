const mongoose = require('mongoose')

const walletHitorySchema = new mongoose.Schema({
  user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetails'
    },
  amount: {
    type: String
  },
  payment_type:{
    type: String,
    enum: ['deposit', 'paid']
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrdersDetails'
  }
},
{
  timestamps: true,
  strict: true
})

walletHitorySchema.virtual('wallet_history_id').get(function () { return this._id })
walletHitorySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
    delete ret.__v
    delete ret._id
    delete ret.id
    delete ret.createdAt
    delete ret.updatedAt
  }
})
walletHitorySchema.plugin(require('mongoose-autopopulate'))
module.exports = mongoose.model('WalletHistory', categorySchema, 'WalletHistory')
