const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const useraddress = require('../controller/address.controller')
const isLoggedIn = require('../helper/isLoggedIn')

router.post('/add_address',[isLoggedIn], useraddress.address)
router.post('/update_address',[isLoggedIn], useraddress.update_address)
router.get('/get_address',[isLoggedIn], useraddress.getaddress)
router.get('/delete_address/:id',[isLoggedIn], useraddress.deleteaddress)

module.exports = router