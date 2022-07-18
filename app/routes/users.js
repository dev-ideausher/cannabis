const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const users = require('../controller/users.controller')

router.post('/login',  [
    check('mobile')
      .isLength({ min: 10, max: 10 })
      .escape()
  ], users.otp_login)

 module.exports = router