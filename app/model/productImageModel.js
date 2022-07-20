const mongoose = require('mongoose')
const config = require('../helper/config').get(process.env.NODE_ENV) 

const Schema = mongoose.Schema

const productImageDetailsSchema = new mongoose.Schema({
  product: { type: Schema.Types.ObjectId, ref: 'ProductDetails' },
  image_url: {
    type: String
  }
},
{
  timestamps: true,
  strict: true
})
var collectionName = 'ProductImageDetails'
productImageDetailsSchema.virtual('product_image_id').get(function() { return this._id; })
productImageDetailsSchema.virtual('product_id').get(function() { return this.product; })
productImageDetailsSchema.virtual('image').get(function() { return config.BaseUrl+this.image_url })
productImageDetailsSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
      delete ret.__v;delete ret._id
      delete ret.id
      delete ret.product
      delete ret.image_url
      delete ret.updatedAt
      delete ret.createdAt
  },
});

productImageDetailsSchema.plugin(require('mongoose-autopopulate'))
module.exports = mongoose.model('ProductImageDetails',productImageDetailsSchema,collectionName)
