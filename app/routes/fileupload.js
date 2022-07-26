const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const fileupload = require('../controller/fileupload.controller')
const isLoggedIn = require('../helper/isLoggedIn')
const isAdminLoggedIn = require('../helper/isAdminLoggedIn')

const multer = require('multer')
const { memoryStorage } = require('multer')
const storage = memoryStorage()
const upload = multer({ storage })


// file upload routes
router.post('/uploadImage',upload.single('file'),[isLoggedIn], fileupload.uploadImage)

module.exports = router