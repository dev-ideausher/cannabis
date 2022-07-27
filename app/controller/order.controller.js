const Orders = require('../model/orderModel')
const OrderItem = require('../model/orderItemModel')
const OrderCancel = require('../model/orderCancelRequestModel')
const Helper = require('../helper/authtoken')
const { validationResult } = require('express-validator')
const config = require('../helper/config').get(process.env.NODE_ENV)

// create order
exports.create_order = async (req, res) => {
    //validate i/p
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    // auth token
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    try {
        await Orders.create(req.body, async function (err, ordered) {
            if(err) {
              console.log(err.message)
                res.send({status:'Error', message:"error occured"})
            } else if (ordered) {
                req.body.orderedItems.forEach(async function (ele) {
                    const itemJson = {
                        order:ordered._id,
                        product:ele.productId,
                        price:ele.price,
                        discount:ele.discount,
                        quantity:ele.quantity
                    }
                    await OrderItem.create(itemJson)
                })
                res.status(200).json({status: true, message: 'Order placed', data: ordered})
            } else {
                res.send({status: false, message: 'Order not placed', code: 'DB_ERROR'})
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

// list orders by user
exports.getUserOrders = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    // auth token
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    try{
      console.log(req.user_id)
    const orders = await Orders.find({user:req.user_id, is_active:true})
    return res.status(200).json({ success: true, message: 'Orders list', body: { orders } })
    } catch(e) {
      console.log(e)
      return res.status(500).json({
        status: 'Error',
        message: 'error occured'
      })
    }
  }

// list orders
exports.getOrders = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    // auth token
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    try{
      const orders = await Orders.find({is_active:true})
      return res.status(200).json({ success: true, message: 'Orders list', body: { orders } })
    } catch(e) {
      console.log(e)
      return res.status(500).json({
        status: 'Error',
        message: 'error occured'
      })
    }
  }


//confirm order
exports.confirm_order = async (req, res) => {
  // i/p validate
  const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    // auth token
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    try {
      const order = req.body
      Orders.findByIdAndUpdate(req.body.orderId, order, function (err, updatedorder) {
        if (err) {
          res.send({ status: 'error', message: err.message })
        } else if (!updatedorder) {
          res.send({ status: false, message: 'Not updated' })
        } else {
          res.send({ status: true, message:'Your Order Confirmed', OrderId: updatedorder})
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

//cancel orders
exports.cancelOrder = async (req, res) => {
  //i/p validate
  const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    // auth token
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    try{
      const ordercancelJson = {
        order:req.body.orderId,
        user:req.user_id,
        reason: req.body.reason
      }
      OrderCancel.create(ordercancelJson, function (err, requested) {
        if(err) {
          res.send({ status: 'error', message: 'error occured'})
        } else if (requested) {
          res.status(200).json({ status:true, message: 'cancel request initiated'})
        } else {
          res.status(400).json({ status:false, message: 'cancel request not initiated'})
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

//cancel orders
exports.admincancelOrders = async (req, res) => {
  //i/p validate
  const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    // auth token
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    try{
      const ordercancelJson = {
        order:req.body.orderId,
        user:req.admin_id,
      }
      OrderCancel.create(ordercancelJson, async function (err, requested) {
        if(err) {
          console.log(err)
          res.send({ status: 'error', message: 'error occured'})
        } else if (requested) {
          await Orders.findOneAndUpdate({_id:req.body.orderId}, {status:6,is_active:false})
          res.status(200).json({ status:true, message: 'cancel request initiated'})
        } else {
          res.status(400).json({ status:false, message: 'cancel request not initiated'})
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


//admin confirms user cancel request
exports.adminAcceptCancelOrders = async (req, res) => {
  //i/p validate
  const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    // auth token
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    try{
      //accept cancel request
      Orders.findOneAndUpdate({_id:req.body.orderId}, {status:6,is_active:false}, function (err, updated) {
        if(err) {
          res.send({ status: 'error', message: 'error occured'})
        } else if (updated) {
          res.status(200).json({ status:true, message: 'cancel request accepted'})
        } else {
          res.status(400).json({ status:false, message: 'cancel request not accepted'})
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