const Notification = require('../model/notificationModel')
const admin = require("firebase-admin")

// send notification
const sendNotification = async(topic,title,desc) => {
    const messaging = admin.messaging()
    var payload = {
        notification: {
            title,
            body: desc
        },
        topic: topic
        };

    messaging.send(payload)
    .then((result) => {
        console.log(result)
    })
    await Notification.create({
        title:title,
        desc:desc
    })
}

module.exports = sendNotification