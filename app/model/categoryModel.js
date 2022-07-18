const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String
  },
  is_active: {
    type: String
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  }
},
{
  timestamps: true,
  strict: true
})
categorySchema.virtual('category_id').get(function () { return this._id })
categorySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
    delete ret.__v
    delete ret._id
    delete ret.id
    delete ret.createdAt
    delete ret.updatedAt
    delete ret.is_active
    delete ret.parent
  }
})
module.exports = mongoose.model('Category', categorySchema, 'category')
