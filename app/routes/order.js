const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const orders = require('../controller/order.controller')
const isLoggedIn = require('../helper/isLoggedIn')
const isAdminLoggedIn = require('../helper/isAdminLoggedIn')

// user routes
router.post('/order',[
    check('total')
      .escape(),
    check('line_total')
      .escape(),
    check('shipping_cost')
    .escape(),
    check('driver')
    .escape(),
    check('shipping_cost')
    .escape(),
    check('shipping_address_id')
    .escape(),
    check('payment_option')
    .escape(),
    check('orderedDate')
    .escape(),
    check('deliveryDate')
    .escape(),
  ], orders.create_order)

  module.exports = router