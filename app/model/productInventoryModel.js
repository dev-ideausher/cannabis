const mongoose = require('mongoose')

const inventoryDetailsSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductDetails'
  },
  measurement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Measurements',
    autopopulate:true
  },
  quantity: {
    type: Number
  },
  price: {
    type: Number
  },
  weight:{
    type: String
  },
  is_available: {
    type: Boolean,
    default:true
  },
},
{
  timestamps: true,
  strict: true
})

var collectionName = 'inventory'

inventoryDetailsSchema.virtual('product_inventory_id').get(function() { return this._id; });
inventoryDetailsSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
      delete ret.__v
      delete ret._id
      delete ret.id
      delete ret.updatedAt
      delete ret.createdAt
  },
});
inventoryDetailsSchema.plugin(require('mongoose-autopopulate'))
module.exports = mongoose.model('InventoryDetails', inventoryDetailsSchema, collectionName)
