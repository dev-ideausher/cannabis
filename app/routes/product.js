const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const product = require('../controller/product.controller')
const isLoggedIn = require('../helper/isLoggedIn')
const isAdminLoggedIn = require('../helper/isAdminLoggedIn')

// admin routes
router.post('/add_products', [isAdminLoggedIn], product.addProducts)
router.post('/update_products', [isAdminLoggedIn], product.updateProducts)

// user routes
router.get('/getProducts', product.getProducts)
router.get('/getOneProduct/:id', product.getOneProduct)
router.get('/getCategoryProducts', product.getCategoryProducts)



module.exports = router