const express = require('express')
const Users = require('../model/userModel')
const config = require('../helper/config').get(process.env.NODE_ENV)
const jwt = require('jwt-simple')
const Helper = require('../helper/auth')
const { validationResult } = require('express-validator')


exports.otp_login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(200).json({ success: false, message: 'Authentication Failed', parameters: null })
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
        //find user
        const users = await Users.findOne({ _id: user._id, is_deleted: false })

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