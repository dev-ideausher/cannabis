const Category = require('../model/categoryModel')
const { validationResult } = require('express-validator')
const config = require('../helper/config').get(process.env.NODE_ENV)
const Helper = require('../helper/authtoken')

// add category
exports.addCategory = async (req, res) => {
    // i/p validate
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid Inputs', errors: errors.array(), code: 'INVALID_INPUT' })
    }
    //auth token
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    const Categoryjson = {
      categoryName: req.body.categoryName,
      is_active: true,
      parent: req.body.parent
    }
  
    if (req.body.parent === 'None') {
      delete Categoryjson.parent
    }
    const categoryInfo = await Category.create(Categoryjson)
    return res.status(200).json({ success: true, message: 'Category Saved Successfully', Category: categoryInfo })
  }
  
// update category
exports.updateCategory = async (req, res) => {
    
    //auth token
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(403).json({ success: false, message: 'Authentication Failed', parameters: null })
    }

    const Categoryjson = {
      categoryName: req.body.categoryName,
      is_active: true,
      parent: req.body.parent,
    }
    if (req.body.parent === 'None') {
      delete Categoryjson.parent
    }
  
     Category.findOneAndUpdate({ _id: req.body.categoryId }, Categoryjson, function (err, updated) {
        if(err) {
            res.send({status:'error', message: 'error occured'})
        } else if (updated) {
            return res.status(200).json({ success: true, message: 'Category Updated Successfully' })
        } else {
            return res.send({status: false, message: 'category not updated'})
        }
    })
  }

// get category
exports.getCategory = async (req, res) => {
  //auth token
    const authParams = config.SALT
    if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
      return res.status(200).json({ success: false, message: 'Authentication Failed', parameters: null })
    }
    const categories = await Category.find({ parent: null,is_active: true })
    let catArray = []
    categories.forEach( async function (ele) {
        const parCat =  await Category.find({ parent:ele._id, is_active: true })
        let catjson = {
            category: ele,
            subcategory: parCat
        }
         catArray.push(catjson)
         if(catArray.length === categories.length){
            return res.json({ success: true, message: 'Category List', body: { categoryList: catArray } })
         }
    })
  }

// delete category
exports.delete_category = async (req, res) => {
  //auth token
  const authParams = config.SALT
  if (!Helper.checkAuthToken(req.headers.auth_token, authParams)) {
    return res.status(200).json({ success: false, message: 'Authentication Failed', parameters: null })
  }
   const category = { is_active: false }
    await Category.findOneAndUpdate({ _id: req.params.id }, category)
    return res.status(200).json({ success: true, message: 'Category Deleted Successfully' })
}