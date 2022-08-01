const mongoose = require('mongoose')
const config = require('../helper/config').get(process.env.NODE_ENV) 

const paymentStatusSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrdersDetails'
  },
  online_status: {
    type: String
  },
  payment_type: {
    type: String
  }
},
{
  timestamps: true,
  strict: true
})

var collectionName = 'paymentstatus' 
paymentStatusSchema.virtual('paymentstatus_id').get(function() { return this._id })
paymentStatusSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
      delete ret.__v
      delete ret._id
      delete ret.id
      delete ret.createdAt
      delete ret.updatedAt
  }
})
module.exports = mongoose.model('paymentstatus', paymentStatusSchema,collectionName)
