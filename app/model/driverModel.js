const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment-fix')

const DriverSchema = new mongoose.Schema({
    driverid: { type: Number },
    name: {
        type: String
    },
    phone_number: {
        type: Number
    },
    is_online: {
        type: Boolean,
        default: false
    },
    is_otp_verified: {
        type: Boolean,
        default: false
    },
    password:{
        type: String
    }
}, {
    timestamps: true,
    strict: true
})


autoIncrement.initialize(mongoose);
DriverSchema.plugin(autoIncrement.plugin, {
    model: 'driverdetails',
    field: 'driverid',
    startAt: 1,
    incrementBy: 1
});

DriverSchema.virtual('driver_no').get(function() { return 'CAN_DRIVER_'+ this.driverid })
DriverSchema.virtual('driver_id').get(function() { return this._id; });

DriverSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret._id;
        delete ret.id;
        delete ret.driverid;
        delete ret.fcm_token;
        delete ret.password;
        delete ret.updatedAt, delete ret.createdAt;
    },
});

module.exports = mongoose.model('DriverDetails', DriverSchema, 'driverdetails')