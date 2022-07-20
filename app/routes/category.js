const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const category = require('../controller/category.controller')
const isLoggedIn = require('../helper/isLoggedIn')
const isAdminLoggedIn = require('../helper/isAdminLoggedIn')

// admin routes
router.post('/addCategory', [isAdminLoggedIn], [
    check('categoryName')
    .escape()
], category.addCategory)

router.post('/updateCategory', [isAdminLoggedIn], category.updateCategory)
router.get('/deletecategory/:id', [isAdminLoggedIn], category.delete_category)

//user routes
router.get('/getCategory', category.getCategory)
router.delete


module.exports = router