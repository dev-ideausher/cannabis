const Users = require('../model/userModel')
const UserWallet = require('../model/userWalletModel')
const Ratings = require('../model/ratingModel')
const Measurements = require('../model/measurementModel')
const Banners = require('../model/bannerModel')
const UserCard = require('../model/userCardModel')
const config = require('../helper/config').get(process.env.NODE_ENV)
const jwt = require('jwt-simple')
const Helper = require('../helper/authtoken')
const { validationResult } = require('express-validator')
const md5 = require('md5')
const crypto = require('crypto')
const algorithm = 'aes-256-cbc' //Using AES encryption
const key = crypto.randomBytes(32)
const iv = crypto.randomBytes(16);


function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv)
    let encrypted = cipher.update(text)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') }
}

 function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex')
    let encryptedText = Buffer.from(text.encryptedData, 'hex')
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
 }
 

exports.otp_login = async (req, res) => {
    //validate i/p
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    // find user
    const users = await Users.findOne({ mobile: req.body.mobile, is_active: true })
    if (users) { // if found send otp
        const url = req.headers.host
        return await sendOtp(users, res, url)
    } else { // create user
        const ref = Math.floor(1000 + Math.random() * 9000)
        const user = {
            mobile: req.body.mobile,
            is_active: true,
            login_type: 'OTP',
            referral_code: 'REF-' + ref
        }
        
        // insert user
        const userres = await Users.create(user)
        const walletJson = {
            amount:0,
            user: userres._id
        }
        const walletcreation = await UserWallet.create(walletJson)
        if(userres) {
            return await sendOtp(userres, res)
        } else {
            res.status(500).json({ success: false, message: 'User Not saved', code: 'INVALID_USER' })
        }
        
    }
}

// send otp
const sendOtp = async (user, res, url) => {
    // generate otp
    let otp = Math.floor(1000 + Math.random() * 9000)
    // match host
    if(config.HeadersUrl === url) {
        // otp send logic needs to implement
        // update otp of user
         Users.findOneAndUpdate({ _id: user._id }, { otp: otp }, async function (err, updated) {
            if(err) {
                res.send({status: 'error', message: 'error occured'})
            } else if(updated) {
                const users = await Users.findOne({ _id: user._id, is_deleted: false })
                const op = users.toJSON()
                // token generate
                const token = 'Bearer ' + jwt.encode(op, config.jwtSecret)
                op.token = token
                return res.json({ success: true, message: 'OTP Sent', body: { user: op } })
            } else {
                return res.status(500).json({ success: false, message: 'User Not Updated', code: 'DB_ERROR' })
              }
        })
    } else { // host not matched
        res.send({ status: false, message: 'host not matched'})
    }
}

// validate user otp
exports.validate_otp = async (req, res) => {
    // i/p validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(200).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    // authtoken
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(200).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    //validating user otp
    const users = await Users.findOne({ mobile: req.body.mobile, otp: req.body.otp, is_deleted: false })
    if (!users) {
      return res.status(200).json({ success: false, message: 'Invalid OTP', code: 'DB_ERROR' })
    } else {
         Users.findOneAndUpdate({ _id: users._id }, { is_otp_verified: true }, async function (err, updated) {
            if(err) {
                res.status(400).json({status: 'error', message: 'error occured'})
            } else if(updated) {
                const op = users.toJSON()
                const token = 'Bearer ' + jwt.encode(op, config.jwtSecret)
                 op.token = token
                return res.status(200).json({ success: true, message: 'Logged in successfully', Users: op })
            }
         })
    }
}

// update user info
exports.userupdate = async (req, res) => {
    //i/p validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    //auth token validate
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(200).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    // user json
    const userdata = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dob: req.body.dob
    }
    // update user
    Users.findOneAndUpdate({ _id: req.user_id }, userdata, function (err, updated) {
        if(err) {
            res.status(400).json({status: 'error', message: 'error occured'})
        } else if (updated) {
            res.status(200).json({ status: true, message: 'user profile updated', data: updated})
        } else {
            res.status(400).json({ status: false, message: 'user not updated'})
        }
    })
}

// get one user info
exports.getUsers = async (req, res) => {
   //auth token validate
   const authParams = config.SALT
   if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
     return res.status(200).json({ success: false, message: 'Authentication Failed', parameters: null })
   }
    //user details
    Users.findOne({ _id: req.user_id, is_deleted: false }, function (err, found) {
        if(err) {
            res.send({ status: 'error', message: 'error occured'})
        } else if (found) {
            return res.status(200).json({status: true, message:'user profile found', data: found})
        } else {
            return res.send({status: false, message: 'user profile not found'})
        }
    }).populate('address')
  }

//add rating for product
exports.addRating = async (req, res) => {
    //auth token validate
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(200).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    const ratingJson = {
        user:req.user_id,
        product:req.body.productId?req.body.productId:null,
        order:req.body.orderId?req.body.orderId:null,
        ratings:req.body.ratings,
        feedback:req.body.feedback
    }
    const ratings = await Ratings.create(ratingJson)
    res.status(200).json({status: true, message:'Feedback addedd', data:ratings})
}

// ratings list
exports.getRatings = async (req, res) => {
    //auth token validate
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(200).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    try{
        let skip = 0
        let limit = req.query.limit
        let page = req.query.page
        if (page != 1) {
            skip = (page - 1) * 10
        }
        let total = await Ratings.find( {product:req.query.productId}).count()
        
        // measurements list
        Ratings.find( {product:req.query.productId},function (err, found) {
            if(err) {
                res.send({ status: 'error', message: 'error occured'})
            } else if (found.length>0) {
                return res.status(200).json({status: true, message:'Ratings found', data: found, total, limit: limit, current_page: page, next_page: parseInt(page) + 1, prev_page: (page === 1) ? 1 : page - 1 })
            } else {
                return res.send({status: false, message: 'Ratings not found', data: [], total, limit: limit, current_page: page, next_page: parseInt(page) + 1, prev_page: (page === 1) ? 1 : page - 1 })
            }
        }).skip(skip).limit(limit).sort({createdAt:-1})
    } catch(e) {
        console.log(e)
        return res.status(500).json({
        status: 'Error',
        message: 'error occured'
        })
    }
}


// add measurements by admin
exports.addMeasurements = async (req, res) => {
    //auth token validate
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(200).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    //i/p validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    const measurementJson = {
        measurement_name:req.body.measurement_name,
        symbol:req.body.symbol,
        is_active:req.body.is_active
    }
    const measurement = await Measurements.create(measurementJson)
    res.send({status:true, message:"measurement added", data:measurement})
}

// measurement list
exports.getMeasurements = async (req, res) => {
    //auth token validate
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(200).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    try{
        let skip = 0
        let limit = req.query.limit
        let page = req.query.page
        if (page != 1) {
            skip = (page - 1) * 10
        }
        let total = await Measurements.find( {is_active:true}).count()
        // measurements list
        Measurements.find( {is_active:true}, function (err, found) {
            if(err) {
                res.send({ status: 'error', message: 'error occured'})
            } else if (found.length>0) {
                return res.status(200).json({status: true, message:'measurements found', data: found, total, limit: limit, current_page: page, next_page: parseInt(page) + 1, prev_page: (page === 1) ? 1 : page - 1 })
            } else {
                return res.send({status: false, message: 'measurements not found', data: [], total, limit: limit, current_page: page, next_page: parseInt(page) + 1, prev_page: (page === 1) ? 1 : page - 1 })
            }
        }).skip(skip).limit(limit).sort({createdAt:-1})
    } catch(e) {
        console.log(e)
        return res.status(500).json({
            status: 'Error',
            message: 'error occured'
            })
    }
}

// update measurements
exports.updateMeasurements = async (req, res) => {
    //auth token validate
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(200).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    //i/p validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    const measurementJson = {
        measurement_name:req.body.measurement_name,
        symbol:req.body.symbol,
        is_active:req.body.is_active
    }
    // update
    Measurements.findOneAndUpdate( {_id: req.body.measurementId}, measurementJson, function (err, updated) {
        if(err) {
            res.send({ status: 'error', message: 'error occured'})
        } else if (updated) {
            return res.status(200).json({status: true, message:'measurements updated', data: updated})
        } else {
            return res.send({status: false, message: 'measurements not updated'})
        }
    })
}

// delete measurement
exports.deleteMeasurements = async(req, res) => {
    //auth token validate
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(200).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    await Measurements.deleteOne({_id: req.params.Id})
    res.send({status: true, message: 'measurement deleted successfully'})
}

//add Banner
exports.addBanner = async (req, res) => {
    //auth token validate
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(200).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    //i/p validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    const bannerJson = {
        banner_type:req.body.banner_type,
        image_url:req.body.image_url,
        is_active:req.body.is_active
    }
    const banner = await Banners.create(bannerJson)
    res.send({status:true, message:"banner added", data:banner})
}

//update banner
exports.updateBanner = async (req, res) => {
    //auth token validate
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(200).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    //i/p validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    const bannerJson = {
        banner_type:req.body.banner_type,
        image_url:req.body.image_url,
        is_active:req.body.is_active
    }
    // update
    Banners.findOneAndUpdate( {_id: req.body.bannerId}, bannerJson, function (err, updated) {
        if(err) {
            res.send({ status: 'error', message: 'error occured'})
        } else if (updated) {
            return res.status(200).json({status: true, message:'banner updated', data: updated})
        } else {
            return res.send({status: false, message: 'banner not updated'})
        }
    })
}

//banner list
exports.getBanner = async (req, res) => {
    //auth token validate
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(200).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    // banner list
    Banners.find({is_active: true}, function (err, found) {
        if(err) {
            res.send({ status: 'error', message: 'error occured'})
        } else if (found.length>0) {
            return res.status(200).json({status: true, message:'banner found', data: found})
        } else {
            return res.send({status: false, message: 'banner not found'})
        }
    })
}

//delete banner
exports.deleteBanner = async(req, res) => {
    //auth token validate
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(200).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    await Banners.deleteOne({_id: req.params.id})
    res.send({status: true, message: 'banner deleted successfully'})
}

//add Card Details
exports.addCardDetails = async (req, res) => {
    //auth token validate
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(200).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    //i/p validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }

    const cardDetailsJson = {
        user:req.user_id,
        card_holder_name:encrypt(req.body.card_holder_name),
        card_number:encrypt(req.body.card_number),
        cvc:encrypt(req.body.cvc),
        card_type:req.body.card_type,
        expiryDate:req.body.expiryDate
    }
    const userCard = await UserCard.create(cardDetailsJson)
    res.send({status:true, message:"user card details added"})
}

//get user card details
exports.getCardDetails = async (req, res) => {
    //auth token validate
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(200).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    // measurements list
    UserCard.find({is_active: true}, function (err, found) {
        if(err) {
            res.send({ status: 'error', message: 'error occured'})
        } else if (found.length>0) {
            let arr = []
            found.forEach(ele => {
                const cardJson = {
                    card_holder_name:decrypt(ele.card_holder_name),
                    card_number:decrypt(ele.card_number),
                    card_type:ele.card_type
                }
                arr.push(cardJson)
            })
            return res.status(200).json({status: true, message:'user card details found', data: arr})
        } else {
            return res.send({status: false, message: 'user card details not found'})
        }
    })
}


// delete card details
exports.deleteCardDetails = async(req, res) => {
    //auth token validate
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(200).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    await UserCard.deleteOne({_id: req.params.Id})
    res.send({status: true, message: 'card details deleted successfully'})
}