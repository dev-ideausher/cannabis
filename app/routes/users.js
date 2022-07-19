const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const users = require('../controller/users.controller')
const isLoggedIn = require('../helper/isLoggedIn')


router.post('/login',[
    check('mobile')
      .isLength({ min: 10, max: 10 })
      .escape()
  ], users.otp_login)

router.post('/validate_otp', [
    check('mobile')
    .isLength({ min: 10, max: 10 })
    .escape(),
    check('otp')
    .escape()
], users.validate_otp)

router.post('/userupdate', [isLoggedIn], [
  check('firstName')
  .escape(),
  check('lastName')
  .escape(),
  check('dob')
  .escape()
], users.userupdate)

router.get('/profile', [isLoggedIn], users.getUsers)



 module.exports = router