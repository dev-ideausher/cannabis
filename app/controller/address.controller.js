const UserAddress = require('../model/userAddressModel')
const { validationResult } = require('express-validator')

// add user address
exports.address = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
  
    const addressJson = {
      user: req.user_id,
      house_no: req.body.house_no?req.body.house_no:"",
      address: req.body.address?req.body.address:"",
      state: req.body.state?req.body.state:"",
      postalCode: req.body.postalCode?req.body.postalCode:"",
      latitude: req.body.latitude?req.body.latitude:0,
      longitude: req.body.longitude?req.body.longitude:0,
      isDefault: req.body.isDefault?req.body.isDefault:false
    }
  
    // update default user address
    if (req.body.isDefault === true) {
      await UserAddress.updateMany({ user: req.user_id }, { isDefault: false }, function (err, def) {
        if (err) {
          res.send({ status: false, message: err.message })
        }
      })
      addressJson.isDefault = req.body.isDefault
    } 
    const addressInfo = await UserAddress.create(addressJson)
    return res.status(200).json({ success: true, message: 'Address added Successfully', body: { data: addressInfo } })
  }

  // update user address
  exports.update_address = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }

    const addressJson = {
      user: req.user_id,
      house_no: req.body.house_no?req.body.house_no:"",
      address: req.body.address?req.body.address:"",
      state: req.body.state?req.body.state:"",
      postalCode: req.body.postalCode?req.body.postalCode:"",
      latitude: req.body.latitude?req.body.latitude:0,
      longitude: req.body.longitude?req.body.longitude:0,
      isDefault: req.body.isDefault
    }

    // update default user address
    if (req.body.isDefault === true) {
      await UserAddress.updateMany({ user: req.user_id }, { isDefault: false }, function (err, def) {
        if (err) {
          res.send({ status: false, message: err.message })
        }
      })
      addressJson.isDefault = req.body.isDefault
    }

     UserAddress.findOneAndUpdate({_id:req.body.addressId}, addressJson, function (err, updated) {
      if(err) {
        res.send({status: 'error', message: 'error occured', code: 'DB_ERROR'})
      } else if(updated) {
        res.status(200).json({status: true, message: 'user address updated', data: updated})
      } else {
        res.send({ status: false, message: 'user address not updated / not found'})
      }
     })
  }

  // user address list
  exports.getaddress = async (req, res) => {
    const addressInfo = await UserAddress.find({ user: req.user_id })
    return res.status(200).json({ success: true, message: 'Address List ', body: { User_Address: addressInfo } })
  }
  
  // delete user address
  exports.deleteaddress = async (req, res) => {
    const addressInfo = await UserAddress.deleteOne({ _id: req.params.id })
    return res.status(200).json({ success: true, message: 'Address Deleted ' })
  }