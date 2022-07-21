const mongoose = require('mongoose')

const ratingsDetailsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetails'
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrdersDetails'
  },
  product:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductDetails'
  },
  ratings: {
    type: Number
  },
  feedback: {
    type: String
  }
},
{
  timestamps: true,
  strict: true
})
var collectionName = 'ratings'
ratingsDetailsSchema.virtual('user_id').get(function() { return this._id; })
ratingsDetailsSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
      delete ret.__v
      delete ret._id
      delete ret.id
  },
})
module.exports = mongoose.model('Ratings', ratingsDetailsSchema,collectionName)

