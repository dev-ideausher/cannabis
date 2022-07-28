const Wallet = require('../model/userWalletModel')
const WalletHistory = require('../model/walletHistoryModel')
const Helper = require('../helper/authtoken')
const { validationResult } = require('express-validator')
const config = require('../helper/config').get(process.env.NODE_ENV)

exports.addWalletTransaction = async (req,res) => {
     // validate i/p
     const errors = validationResult(req)
     if (!errors.isEmpty()) {
         return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
     }
     // auth_token
     const authParams = config.SALT
     if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
       return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
     }
     try{
        await WalletHistory.create(req.body, function (err, created) {
            if(err) {
                consoel.log(EvalError)
                res.send({status: 'error', message: 'error occured'})
            } else if (created) {
                res.status(200).json({ status: true, message: 'wallet history added', data: updated})
            } else {
                res.status(400).json({ status: false, message: 'wallet history not added'})
            }
        })
        
    } catch(e) {
        console.log(e)
        return res.status(500).json({
          status: 'Error',
          message: 'error occured'
        })
    }
}