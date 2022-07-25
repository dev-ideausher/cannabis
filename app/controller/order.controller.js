const Orders = require('../model/orderModel')
const OrderItem = require('../model/orderItemModel')
const Helper = require('../helper/authtoken')
const { validationResult } = require('express-validator')

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
                res.send({status:'Error', message:"error occured"})
            } else if (data) {
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
    } catch (error) {
        console.log(error)
		return res.status(500).json({
			status: 'Error',
			message: 'error occured'
		})
	}
}

exports.orders = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    const orders = await Orders.OrdersFind({ user: req.body.user_id })
    return res.status(200).json({ success: true, message: 'Orders list', body: { orders } })
  }


  // admin order update
exports.admin_update_order = async (req, res) => {
    const order = req.body
    orders.findByIdAndUpdate(req.body.orderId, order, function (err, updatedorder) {
      if (err) {
        res.send({ status: 'error', message: err.message })
      } else if (!updatedorder) {
        res.send({ status: false, message: 'Not updated' })
      } else {
        res.send({ status: true, OrderId: updatedorder._id })
      }
    })
  }