const multer = require('multer')
const { memoryStorage } = require('multer')
const storage = memoryStorage();
const upload = multer({ storage })
const uploadFile = require('../utils/uploadFile')
const config = require('../helper/config').get(process.env.NODE_ENV)

exports.uploadFile = async (req, res) => {
    // i/p validate
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    // authtoken
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
    }

    let filename = 'cannabis-'
    const type = req.body.type
    const user = req.user
    let link

    filename = filename + "user-front-id" + req.file.originalname
    link = await uploadFile(filename, config.AWS_S3_BUCKET_NAME, file, req.file.mimetype)

    if(link) {
        return res.status(200).json({status:true, message:"File uploaded", url:link})   
    } else {
        return res.send({ status:false, message: 'File not uploaded'})
    }

}