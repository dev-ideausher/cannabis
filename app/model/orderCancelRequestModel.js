const mongoose = require('mongoose')
const config = require('../config').get(process.env.NODE_ENV)

const cancelRequestSchema = new mongoose.Schema({
  orderNo: {
    type: Number
  },
  orderDate: {
    type: Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetails',
    autopopulate: true
  },
  total: {
    type: Number
  },
  cancelType: {
    type: String,
    enum: ['full', 'partial']
  },
  reason: {
    type: String
  },
  image: { type: String },
  orderItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderItemDetails'
  }]

}, {
  timestamps: true,
  strict: true
})

cancelRequestSchema.virtual('order_cancel_id').get(function() { return this._id })
cancelRequestSchema.virtual('package_image').get(function() { return config.BaseUrl+this.image_url })
cancelRequestSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
      delete ret.__v
      delete ret._id
      delete ret.id
      delete ret.updatedAt
      delete ret.createdAt
    }
  })
  
cancelRequestSchema.plugin(require('mongoose-autopopulate'))
module.exports = mongoose.model('CancelRequest', cancelRequestSchema, 'CancelRequest')

