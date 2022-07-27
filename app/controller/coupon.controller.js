const Coupon = require('../model/couponModel')
const CouponProduct = require('../model/couponProductModel')
const Helper = require('../helper/authtoken')
const { validationResult } = require('express-validator')
const config = require('../helper/config').get(process.env.NODE_ENV)

// add coupon
exports.addCoupon = async (req, res) => {
    // validate i/p
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    // auth_token
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    try{
        Coupon.create(req.body, async function(err, data) {
            if(err) {
                res.send({ status: 'error', message: 'error occured'})
            } else if (data) {
                if(req.body.type == 'PRODUCT') {
                    req.body.products.forEach(async function (ele) {
                        const couponProdcutJson = {
                            coupon:data._id,
                            product:ele
                        }
                        await CouponProduct.create(couponProdcutJson)
                    })
                }
               res.status(200).json({ status: true, message:'Coupon added', data: data})
            } else {
                res.status(400).json({ status: false, message: 'Coupon not added'})
            }
        }) 
    } catch(e) {
        console.log(e)
        return res.status(500).json({
          status: 'Error',
          message: 'error occured'
        })
    }
}

exports.getCoupon = async(req, res) => {
    // auth_token
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    try {
        //coupon list
        Coupon.find({is_active:true},function (err,found) {
            if(err) {
                res.send({ status: 'error', message: 'error occured'})
            } else if (found.length>0) {
                res.status(200).json({status: true, message: 'Coupon list', data: found})
            } else {
                res.status(400).json({ status: false, message: 'No Coupon'})
            }
        })
    } catch(e) {
        console.log(e)
        return res.status(500).json({
          status: 'Error',
          message: 'error occured'
        })
    }
}

// update coupon
exports.updateCoupon = async (req, res) => {
    // auth_token
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    try {
        Coupon.findOneAndUpdate({ _id: req.body.couponId}, req.body, function (err, updated){
            if(err) {
                res.send({ status: 'error', message: 'error occured'})
            } else if (updated) {
                res.status(200).json({status: true, message: 'Coupon updated' })
            } else {
                res.status(400).json({ status: false, message: 'Coupon not updated'})
            }
        })
    } catch(e) {
        console.log(e)
        return res.status(500).json({
          status: 'Error',
          message: 'error occured'
        })
    }
}

// delete coupon
exports.deleteCoupon = async (req, res) => {
    // auth_token
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    try {
        Coupon.deleteOne({ _id: req.params.couponId}, req.body, function (err, deleted){
            if(err) {
                res.send({ status: 'error', message: 'error occured'})
            } else if (deleted) {
                res.status(200).json({status: true, message: 'Coupon deleted'})
            } else {
                res.status(400).json({ status: false, message: 'Coupon not deleted'})
            }
        })
    } catch(e) {
        console.log(e)
        return res.status(500).json({
        status: 'Error',
        message: 'error occured'
        })
    }
}