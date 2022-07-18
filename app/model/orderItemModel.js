const mongoose = require('mongoose')

const OrderItemsDetailsSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrdersDetails'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductDetails',
    autopopulate: true
  },
  price: {
    type: Number
  },
  gst: {
    type: Number
  },
  discount: {
    type: Number
  },
  gst_amount: {
    type: Number
  },
  quanity: {
    type: Number
  }
},
{
  timestamps: true,
  strict: true
})
const collectionName = 'order_items'
OrderItemsDetailsSchema.virtual('orderItem_id').get(function() { return this._id })
OrderItemsDetailsSchema.virtual('unit_price').get(function() { return Math.round(this.price / this.quanity); });

OrderItemsDetailsSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
    delete ret.__v
    delete ret._id
    delete ret.id
    delete ret.updatedAt,
    delete ret.createdAt
  }
})
OrderItemsDetailsSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('OrderItemDetails', OrderItemsDetailsSchema, collectionName)
