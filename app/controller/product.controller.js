const Products = require('../model/productModel')
const ProductStock = require('../model/productInventoryModel')
const { validationResult } = require('express-validator')
const config = require('../helper/config').get(process.env.NODE_ENV)
const Helper = require('../helper/authtoken')

// add product
exports.addProducts = async(req, res) => {
  // i/p validate
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
  }
  // autentication 
  const authParams = config.SALT
  if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
  }
  //product json
  const productJson = {
    product_name:req.body.product_name,
    description:req.body.description,
    price:req.body.price,
    selling_price:req.body.selling_price,
    discount:req.body.discount,
    is_active:req.body.is_active,
    effects:req.body.effects,
    category:req.body.category,
    added_by:req.admin_id,
    license_no:req.body.license_no,
    product_type:req.body.product_type
  }
  // insert product
   const product = await Products.create(productJson)
    req.body.measurement_stock_product.forEach(async function (element) {
      console.log(product._id)
      const productStockJson = {
        product:product._id,
        measurement:element.measurement,
        quantity:element.quantity,
        weight:element.weight,
        price:element.price  
       }
       const productstock =  ProductStock.create(productStockJson)
    })
   res.send({ status: true, messasge:'product inserted', data: product})
}

exports.updateProducts = async(req, res) => {
  // i/p validate
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
  }
  // autentication 
  const authParams = config.SALT
  if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
  }
  //product json
  const productJson = {
    product_name:req.body.product_name,
    description:req.body.description,
    price:req.body.price,
    selling_price:req.body.selling_price,
    discount:req.body.discount,
    is_active:req.body.is_active,
    effects:req.body.effects,
    category:req.body.category,
    license_no:req.body.license_no,
    product_type:req.body.product_type
  }
  // insert product
  Products.findOneAndUpdate({_id:req.body.productId},productJson, function (err, updated) {
    if(err) {
      res.send({status: 'error', message:'error occured'})
    } else if (updated) {
      req.body.measurement_stock_product.forEach(async function (element) {
        const productStockJson = {
          product:req.body.productId,
          measurement:element.measurement,
          quantity:element.quantity,
          weight:element.weight,
          price:element.price  
         }
         const productstock =  await ProductStock.findOneAndUpdate({_id:req.body.porductstockId},productStockJson)
      })
      res.status(200).json({ status: true, messasge:'product updated', data: updated})
    } else {
      res.send({status: false, message:'Product not updated'})
    }
   })
}



// get products
exports.getProducts = async (req, res) => {
  // autentication 
  const authParams = config.SALT
  if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
  }
  let query = {}
  if (req.body.productId !== '') {
    query = {product_type:req.body.product_type}
  } else {
    query = {is_active:true}
  }

  //find product
  Products.find({is_active:true}, function (err, found) {
    if(err) {
      console.log(err.message)
      res.send({status: 'error', message:'error occured'})
    } else if (found.length > 0) {
      let arrcat = []
      let priceArr = []
      if(req.body.catgeoryId !== '') {
        found.forEach(ele => {
          ele.category.forEach(element=> {
            if(element.categoryName === req.query.category) {
              arrcat.push(ele)
            }
          })
        })
      if(req.query.startPrice !=='' && req.query.endPrice !== '') {
        arrcat.forEach(ele => {
          ele.stock_price.forEach(element => {
            if(element.price >= req.query.startPrice && element.price <= req.query.endPrice ) {
              priceArr.push(ele)
            }
          })
        })
      }
    }
    res.status(200).json({status: true, message:'Products found', data: priceArr})
    } else {
      res.send({status: false, message:'No products'})
    }
  })
}

exports.getOneProduct = async (req, res) => {
  // authentication 
  const authParams = config.SALT
  if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
  }
  Products.findOne({_id:req.params.id,is_active: true}, function (err, found) {
    if(err) {
      res.send({status: 'error', message:'error occured'})
    } else if (found) {
      res.status(200).json({status: true, message:'Product found', data: found})
    } else {
      res.send({status: false, message:'No product'})
    }
  })
}

// get category products
exports.getCategoryProducts = async (req, res) => {
  // authentication 
  const authParams = config.SALT
  if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
  }
   const categoryProduct = await Products.find({category: req.body.categoryId})
   res.send({status:true, message:'catgeory products', data:categoryProduct })
}




