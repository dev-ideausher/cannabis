const mongoose = require('mongoose')

const productDetailsSchema = new mongoose.Schema({
  product_name: {
    type: String
  },
  description: {
    type: String
  },
  is_active: {
    type: Boolean,
    default: true
  },
  license_no: {
    type:String
  },
  product_type:{
    type:String
  },
  discount:{
    type: Number
  },
  effects:[{ name:String, percentage:String }],
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', autopopulate: true  }],
  added_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetails'
  },
}, {
  timestamps: true,
  strict: true
})
const collectionName = 'products'
productDetailsSchema.virtual('product_id').get(function () { return this._id })

productDetailsSchema.virtual('ratings', {
  ref: 'Ratings',
  localField: '_id',
  foreignField: 'product',
  autopopulate: true
})

productDetailsSchema.virtual('stock_price', {
  ref: 'InventoryDetails',
  localField: '_id',
  foreignField: 'product',
  autopopulate: true
})

productDetailsSchema.virtual('product_image', {
  ref: 'ProductImageDetails',
  localField: '_id',
  foreignField: 'product',
  autopopulate: true
})

productDetailsSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
    delete ret.__v
    delete ret._id
    delete ret.id
    delete ret.updatedAt
    delete ret.createdAt
  }
})

productDetailsSchema.plugin(require('mongoose-autopopulate'))
module.exports = mongoose.model('ProductDetails', productDetailsSchema, collectionName)
