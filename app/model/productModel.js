const mongoose = require('mongoose')

const productDetailsSchema = new mongoose.Schema({
  product_name: {
    type: String
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    default: 0
  },
  selling_price: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  is_active: {
    type: Boolean,
    default: true
  },
  category: [{ category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', autopopulate: true } }],
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

productDetailsSchema.virtual('images', {
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
