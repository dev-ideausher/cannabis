const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const coupon = require('../controller/coupon.controller')
const isLoggedIn = require('../helper/isLoggedIn')
const isAdminLoggedIn = require('../helper/isAdminLoggedIn')

// admin routes

//add coupon
router.post('/addCoupon',[
    check('coupon_code')
      .escape(),
    check('discount_type')
      .escape(),
    check('start_date')
      .escape(),
    check('expire_date')
      .escape(),
    check('type_value')
      .escape(),
    check('max_use_per_person')
      .escape(),
    check('max_global_usage')
      .escape(),
    check('min_cart_value')
      .escape(),
    check('max_discount')
      .escape(),
    check('type')
      .escape()
  ], [isAdminLoggedIn], coupon.addCoupon)

  router.get('/adminGetCoupon', [isAdminLoggedIn], coupon.getCoupon)

  router.post('/updateCoupon', [isAdminLoggedIn], coupon.updateCoupon)

  router.get('/deleteCoupon', [isAdminLoggedIn], coupon.deleteCoupon)

  //user routes
  router.get('/getCoupon', [isLoggedIn], coupon.getCoupon)

  router.post('/applyCoupon', [isLoggedIn], coupon.applyCoupon)
  module.exports = router