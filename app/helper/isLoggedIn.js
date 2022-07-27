const Users = require('../model/userModel')
const jwt = require('jwt-simple')
const config = require('../helper/config').get(process.env.NODE_ENV)

module.exports = function isLoggedIn (req, res, next) {
  const header = req.headers['authorization']
  if (typeof header !== 'undefined' && header !== '' && header !== null) {
    const bearer = header.split(' ')
    const token = bearer[1]
    let payload
    if (token !== '') {
      payload = jwt.decode(token, config.jwtSecret)
    } else {
      res.send({ status: false, message: 'Please login and try' })
    }
    Users.findOne({
      '_id': payload.user_id
    }, function (err, data) {
            if (data && data.role == 2) { 
                req.body.user_id=data._id;
                req.user_id=data._id;
            	next(); 
            }
            else
            {
            	//If error send Forbidden (401)
                res.status(401).send({"status":false,"message":"Unauthorized User"});
            }
        
          });
    } else {
        //If header is undefined return Forbidden (403)
        res.send({"status":false,"message":"Authentication is required"});
    }
};
