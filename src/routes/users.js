const express = require('express')
const {body} = require('express-validator')
const controller = require('../controllers/user')
const User = require('../models/User')
const route = express.Router()

//signup
route.post('/signup',
    [
        body('email').isEmail().withMessage('Email is invalid').normalizeEmail(),
        body('fullname').isLength({min:5}).withMessage('Name should be more than 5 characters').trim(),
        body('password').isLength({min:6}).withMessage('Password should be more than 6 characters').trim(),
        body('password').custom((value, {req}) => {
            //console.log(req.body.password_confirm)
           // console.log(value)
            if (value != req.body.password_confirm) {
                throw new Error('Password confirmation is incorrect')
            }else{
                return true
            }
        }),
        body('email').custom(email => {
            return User.findOne({email:email}).then( user  => {
                if(user){
                    return Promise.reject('E-mail already in use')
                }
            })
        })
    ], controller.postSignup)


route.get("/first/", controller.first)

//auth actions
route.post("/login", controller.login)
route.post("/admin/", controller.login)
route.post("/seller/", controller.login)
route.post("/buyer/", controller.login)
module.exports = route