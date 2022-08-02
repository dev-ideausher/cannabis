const mongoose = require('mongoose')

const vehicleRegisterationSchema = new mongoose.Schema({
  registerNumber: {
    type: String
  },
  company: {
    type: String
  },
  model: {
    type: String
  },
  colour: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetails',
    autopopulate: true
},
registeration_url:{
  type:String
}
},
{
  timestamps: true,
  strict: true
})
vehicleRegisterationSchema.virtual('vehicleRegister_id').get(function () { return this._id })
vehicleRegisterationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
    delete ret.__v
    delete ret._id
    delete ret.id
    delete ret.createdAt
    delete ret.updatedAt
  }
})

vehicleRegisterationSchema.plugin(require('mongoose-autopopulate'))
module.exports = mongoose.model('VehicleRegister', vehicleRegisterationSchema, 'VehicleRegister')
