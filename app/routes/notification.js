const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const notifications = require('../controller/notification.controller')
const isLoggedIn = require('../helper/isLoggedIn')
const isAdminLoggedIn = require('../helper/isAdminLoggedIn')


router.post('/sendNotification', [isAdminLoggedIn], [
    check('title')
    .escape(),
    check('desc')
    .escape()
] , notifications.sendNotification)

router.get("/getAllNotifications", notifications.getAllNotifications)

router.post("/:notificationId", [isAdminLoggedIn], notifications.updateNotification)

router.get("/:notificationId", [isLoggedIn], notifications.getOneNotification)

module.exports = router