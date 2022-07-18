const { json } = require('body-parser')
const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    role_name: {
        type: String
    },
    is_active: {
        type: Boolean
    }
}, {
    timestamps: true,
    strict: true
})
var collectionName = 'role'
roleSchema.virtual('role_id').get(function() { return this._id; })

roleSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v
        delete ret._id
        delete ret.id
    },
})
module.exports = mongoose.model('Role', roleSchema, collectionName)