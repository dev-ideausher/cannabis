const express = require('express')
const router = express.Router()
const isLoggedIn = require('../helper/isLoggedIn')
const files = require('../controller/uploadFile.controller')

// file upload
router.post('/', [isLoggedIn] ,[
    check('type')
    .escape() ], upload.single('file'), files.uploadFile)

module.exports = router