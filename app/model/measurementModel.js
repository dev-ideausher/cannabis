const mongoose = require('mongoose')

const MeasurementSchema = new mongoose.Schema({
    measurement_name: {
        type: String
    },
    symbol: {
        type: String
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    strict: true
})
var collectionName = 'measurements'
MeasurementSchema.virtual('measurement_id').get(function() { return this._id; });
MeasurementSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret._id;
        delete ret.id;
        delete ret.createdAt;
        delete ret.updatedAt;
    },
})
module.exports = mongoose.model('Measurements', MeasurementSchema, collectionName)