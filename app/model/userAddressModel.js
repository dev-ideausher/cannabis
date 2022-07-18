const mongoose = require('mongoose')

const addressDetailsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetails'
    },
    house_no: {
        type: String
    },
    address: {
        type: String
    },
    state: {
        type: String
    },
    postalCode: {
        type: String
    },
    latitude: {
        type: Number,
        default: 0
    },
    longitude: {
        type: Number,
        default: 0
    },
    isDefault: {
        type: Boolean
    }
}, {
    timestamps: true,
    strict: true
})

addressDetailsSchema.virtual('address_id').get(function() { return this._id })
addressDetailsSchema.virtual('user_id').get(function() { return this.user })
addressDetailsSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v
        delete ret._id
        delete ret.id
        delete ret.user
        delete ret.updatedAt
        delete ret.createdAt
    },
});
addressDetailsSchema.plugin(require('mongoose-autopopulate'))
module.exports = mongoose.model('AddressDetails', addressDetailsSchema, 'AddressDetails')