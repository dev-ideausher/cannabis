const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const wallets = require('../controller/wallet.controller')
const isLoggedIn = require('../helper/isLoggedIn')
const isAdminLoggedIn = require('../helper/isAdminLoggedIn')

router.post('/addWalletTransaction', [
    check('user')
    .escape(),
    check('amount')
    .escape(),
    check('payment_type')
    .escape()
],[isLoggedIn], wallets.addWalletTransaction)

router.get('/getWalletTransaction', [isLoggedIn], wallets.getWalletTransaction)

module.exports = router