const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const users = require('../controller/users.controller')
const isLoggedIn = require('../helper/isLoggedIn')
const isAdminLoggedIn = require('../helper/isAdminLoggedIn')

// user routes
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

router.post('/ratings', [isLoggedIn], users.addRating)

router.get('/getRatings/:id', users.getRatings)



// admin routes
router.post('/addMeasurements',[
  check('measurement_name')
  .escape(),
  check('symbol')
  .escape(),
], [isAdminLoggedIn], users.addMeasurements)

router.get('/getMeasurements', [isAdminLoggedIn], users.getMeasurements)

router.post('/updateMeasurements',[
  check('measurement_name')
  .escape(),
  check('symbol')
  .escape(),
  check('measurementId')
  .escape(),
], [isAdminLoggedIn], users.updateMeasurements)

router.get('/deleteMeasurement/:id', [isAdminLoggedIn], users.deleteMeasurements)



 module.exports = router