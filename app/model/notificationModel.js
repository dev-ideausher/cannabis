const mongoose = require('mongoose')
const config = require('../helper/config').get(process.env.NODE_ENV) 

const notificationSchema = new mongoose.Schema({
  title: {
    type: String
  },
  desc: {
    type: String
  }
},
{
  timestamps: true,
  strict: true
})

var collectionName = 'notification' 
notificationSchema.virtual('notification_id').get(function() { return this._id })
notificationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
      delete ret.__v
      delete ret._id
      delete ret.id
      delete ret.createdAt
      delete ret.updatedAt
  }
})
module.exports = mongoose.model('notification', notificationSchema,collectionName)
