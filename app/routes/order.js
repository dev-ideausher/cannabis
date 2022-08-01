const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const orders = require('../controller/order.controller')
const isLoggedIn = require('../helper/isLoggedIn')
const isAdminLoggedIn = require('../helper/isAdminLoggedIn')

// user routes

// user create order
router.post('/create_order',[
    check('line_total')
      .escape(),
    check('shipping_cost')
    .escape(),
    check('discount_cost')
    .escape(),
    check('driver')
    .escape(),
    check('user')
    .escape(),
    check('shipping_address_id')
    .escape(),
    check('payment_option')
    .escape(),
    check('orderedDate')
    .escape(),
    check('deliveryDate')
    .escape(),
  ], [isLoggedIn], orders.create_order)

  //list orders
  router.get('/getUserOrders', [isLoggedIn], orders.getUserOrders)

  //cancel order
  router.post('/cancel_order', [
    check('orderId')
    .escape(),
    check('reason')
    .escape()
  ], [isLoggedIn], orders.cancelOrder)


  //admin routes

  //admin create order
  router.post('/admin_create_order',[
    check('total')
      .escape(),
    check('line_total')
      .escape(),
    check('shipping_cost')
    .escape(),
    check('discount_cost')
    .escape(),
    check('driver')
    .escape(),
    check('user')
    .escape(),
    check('shipping_address_id')
    .escape(),
    check('payment_option')
    .escape(),
    check('orderedDate')
    .escape(),
    check('deliveryDate')
    .escape(),
  ], [isAdminLoggedIn], orders.create_order)

  // orders list
  router.get('/getOrders', [isAdminLoggedIn], orders.getOrders)

  //confirm order
  router.post('/admin_confirm_order',[
    check('status')
    .escape(),
    check('orderId')
    .escape(),
  ], [isAdminLoggedIn], orders.confirm_order)

  router.post('/admin_cancel_order',[
    check('orderId')
    .escape()
  ], [isAdminLoggedIn], orders.admincancelOrders)

  router.post('/admin_accept_cancel_order',[
    check('orderId')
    .escape()
  ], [isAdminLoggedIn], orders.adminAcceptCancelOrders)

  // router.post('/payments', [], orders.payments)

  module.exports = router