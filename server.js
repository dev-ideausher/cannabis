const express = require('express')
const path = require('path');
var cors = require('cors')
const app = express()
const config = require('./app/helper/config').get(process.env.NODE_ENV)

app.use(cors())
const mongoose = require('./app/helper/mongoose')

app.use(express.urlencoded({  limit : '50mb', extended: false }))
app.use(express.json({  limit : '50mb' }))

var publicDir = path.join(__dirname,'/');
app.use(express.static(publicDir));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods",'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

require('./app/routes.js')(app)
app.listen(config.port, () => console.log('server is connected on port ' + config.port))

