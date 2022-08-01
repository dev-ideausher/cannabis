const sendNotifications = require('../helper/notification')
const catchAsync = require('../helper/catchAsync')


//send notification
exports.sendNotification = async (req,res) => {
     // i/p validate
     const errors = validationResult(req)
     if (!errors.isEmpty()) {
       return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
     }
     //auth token
     const authParams = config.SALT
     if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
       return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
     }
     try{
        const {title,desc} = req.body
        await sendNotifications("Test",title,desc)
        res.status(200).json({
            status:true,
            message:"Notificaion sent successfully."
        })
     } catch(e) {
        console.log(e)
          return res.status(500).json({
            status: 'Error',
            message: 'error occured'
          })
      }
}

// get notifications
exports.getAllNotifications = async (req,res,next) =>{
    // i/p validate
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    //auth token
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    try{
            let notifications
            let search = req.query.search
            if(search){
                let regex = new RegExp([search].join(""), "i")
                notifications = await Notification.aggregate([
                    {
                        "$match": {
                            "$or":[
                                {"title":{"$regex":regex}}
                            ]
                        },
                    }
                ])

                return res.status(200).json({
                    status:true,
                    results:notifications.length,
                    message:"all notifications",
                    notifications
                })
            }
            notifications = await Notification.find({});

            res.status(200).json({
                status:true,
                results:notifications.length,
                message:"all notifications",
                notifications
            })
        } catch(e) {
            console.log(e)
            return res.status(500).json({
                status: 'Error',
                message: 'error occured'
            })
        }
}


//update notifications
exports.updateNotification = catchAsync(async(req,res,next) =>{

    let notification = await Notification.findByIdAndUpdate(req.params.notificationId,req.body,{new:true})
    res.status(200).json({
        status:true,
        message:"Notification updated.",
        notification
    })
});

//get one notification
exports.getOneNotification = catchAsync(async(req,res,next) =>{

    let notification = await Notification.findById(req.params.notificationId)
    res.status(200).json({
        status:true,
        message:"single notification by Id.",
        notification
    })
});