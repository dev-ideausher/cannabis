const Users = require('../model/userModel')
const Helper = require('../helper/authtoken')
const { validationResult } = require('express-validator')
const config = require('../helper/config').get(process.env.NODE_ENV)
const uploadFile = require('../helper/uploadFile')

// file upload
exports.uploadImage = async (req, res) => {
    //auth_token
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    let USER_IMAGE_BUCKET = config.AWS_S3_USER_BUCKET_NAME
    let file = req.file.buffer
    let filename = 'cannabis-'
    let link
    if(req.body.type== 'user_image') {
        filename = filename + "user-" + req.file.originalname
        link = await uploadFile(filename, USER_IMAGE_BUCKET, file, req.file.mimetype)
    }
    res.send({status: true, data: link})
}