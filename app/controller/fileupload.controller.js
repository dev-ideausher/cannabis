const Users = require('../model/userModel')
const ProductImage = require('../model/productImageModel')
const Banners = require('../model/bannerModel')
const Helper = require('../helper/authtoken')
const config = require('../helper/config').get(process.env.NODE_ENV)
const uploadFile = require('../helper/uploadFile')

// file upload
exports.uploadImage = async (req, res) => {
    //auth_token
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    let USER_IMAGE_ID_BUCKET = config.AWS_S3_USER_ID_BUCKET_NAME
    let file = req.file.buffer
    let filename = 'cannabis-'
    let link
    let type = req.body.type
    if(type == 'user_id_front') {
        filename = filename + "user-id-front" + req.file.originalname
        link = await uploadFile(filename, USER_IMAGE_ID_BUCKET, file, req.file.mimetype)
        await Users.findOneAndUpdate({_id:req.user_id}, {frontId:link})
    } else if (type == 'user_id_back') {
        filename = filename + "user-id-back" + req.file.originalname
        link = await uploadFile(filename, USER_IMAGE_ID_BUCKET, file, req.file.mimetype)
        await Users.findOneAndUpdate({_id:req.user_id}, {backId:link})
    } else if(type == 'product') {
        filename = filename + "product-" + req.file.originalname
        link = await uploadFile(filename, USER_IMAGE_ID_BUCKET, file, req.file.mimetype)
        await ProductImage.create({product:req.body.product,image_url:link })
    } else if (type == 'banner') {
        filename = filename + "banner-" + req.file.originalname
        link = await uploadFile(filename, USER_IMAGE_ID_BUCKET, file, req.file.mimetype)
    } else if (type == 'catgeory') {
        filename = filename + "category-" + req.file.originalname
        link = await uploadFile(filename, USER_IMAGE_ID_BUCKET, file, req.file.mimetype)
    } else {
        filename = filename + req.file.originalname
        link = await uploadFile(filename, USER_IMAGE_ID_BUCKET, file, req.file.mimetype)
    }
    res.send({status: true, data: link})
}