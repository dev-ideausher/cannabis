const mongoose = require('mongoose')
const config = require('../helper/config').get(process.env.NODE_ENV) 

const bannerSchema = new mongoose.Schema({
  banner_type: {
    type: String
  },
  category_key: {
    type: String
  },
  discount_key: {
    type: String
  },
  price_key: {
    type: Number
  },
  image_url: {
    type: String
  },
  is_button: {
    type: Boolean
  },
  is_active:{
    type:Boolean
  }
},
{
  timestamps: true,
  strict: true
})

var collectionName = 'banners' 
bannerSchema.virtual('banner_id').get(function() { return this._id })
bannerSchema.virtual('image').get(function() { return config.BaseUrl+this.image_url })
bannerSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
      delete ret.__v
      delete ret._id
      delete ret.id
      delete ret.createdAt
      delete ret.updatedAt
      delete ret.image_url
  }
})
module.exports = mongoose.model('Banner', bannerSchema,collectionName)
