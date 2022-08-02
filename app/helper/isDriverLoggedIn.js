const Users = require('../model/userModel');
const jwt = require('jwt-simple')
const config = require('../helper/config').get(process.env.NODE_ENV)

module.exports = function isDriverLoggedIn(req, res, next) {

    const header = req.headers['authorization'];
    if (typeof header !== 'undefined' && header !== '' && header !== null) {
        const bearer = header.split(' ')
        const token = bearer[1]
        if(token) {

        const payload = jwt.decode(token, config.jwtSecret)
        Users.findOne({"_id": payload.user_id, role: 3}, function(err, data) {
            if (data && data.role == 3) {
                req.body.driver_id = data._id
                req.driver_id = data._id
                next()
            } else {
                //If error send Forbidden (401)
                res.status(401).send({ "status": false, "message": "Unauthorized User" })
            }

        });
    } else {
        res.status(403).send({ "status": false, "message": "Please login and try to purchase" })
    }
    } else {
        //If header is undefined return Forbidden (403)
        res.status(403).send({ "status": false, "message": "Authentication is required" })
    }
};