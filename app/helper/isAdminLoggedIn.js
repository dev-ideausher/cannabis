const Users = require('../model/userModel');
const jwt = require('jwt-simple')
const config = require('../helper/config').get(process.env.NODE_ENV)

module.exports = function isLoggedIn(req, res, next) {

    const header = req.headers['authorization'];
    if (typeof header !== 'undefined' && header !== '' && header !== null) {
        const bearer = header.split(' ')
        const token = bearer[1]
        if(token) {

        const payload = jwt.decode(token, config.jwtSecret)
        Users.findOne({"_id": payload.user_id, role: 1}, function(err, data) {
            if (data) {
                req.body.admin_id = data._id;
                req.admin_id = data._id;
                next();
            } else {
                //If error send Forbidden (401)
                res.status(401).send({ "status": false, "message": "Unauthorized User" });
            }

        });
    } else {
        res.status(403).send({ "status": false, "message": "Please login and try to purchase" });
    }
    } else {
        //If header is undefined return Forbidden (403)
        res.status(403).send({ "status": false, "message": "Authentication is required" });
    }
};