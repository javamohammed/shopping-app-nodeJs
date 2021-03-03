const bcrypt = require('bcryptjs')
const { DBRef } = require('mongodb');
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')

const {createRoles } = require('../middlewares/checkerFunctions')
const config = require('../../config/auth.config')
const User = require('../models/User')
const Role = require('../models/Role')


exports.first = async (req, res ) => {
  const countUser = await User.countDocuments();
  return res.status(200).json({
    count:countUser
  });
}

exports.postSignup = async (req, res, ) => {
    createRoles()
    let user_type = req.body.user_type
    let userTypeError =''
    if(user_type === "" || user_type === undefined){
        const countUser = await User.countDocuments();
        if(countUser === 0){
            user_type = "ADMIN"
        }else{
            userTypeError = 'please, select your account type'
        }
    }else{
        if (user_type != 'SELLER' && user_type != 'BUYER') {
            userTypeError = 'please, select your account type'
        }
    }
    const errors = validationResult(req)
    let emailError =''
    let fullNameError = ''
    let passwordError = ''
    let password_confirmError = ''
    if(!errors.isEmpty()){
        errors.array().forEach(function (obj) {
            if (obj.param == 'fullname') {
                fullNameError = obj.msg
                return res.status(422).end(JSON.stringify({ 
                  error: fullNameError,
                  
               }))
            }
            if (obj.param == 'email') {
                emailError = obj.msg
                return res.status(422).end(JSON.stringify({ 
                  error: emailError,
               }))
            }
            if (obj.param == 'password_confirm') {
                password_confirmError = obj.msg
                return res.status(422).end(JSON.stringify({ 
                  error: password_confirmError,
               }))
            }
            if (obj.param == 'password') {
                passwordError = obj.msg
                return res.status(422).end(JSON.stringify({ 
                  error: passwordError,
               }))
            }

        })
        /*
        return res.status(422).end(JSON.stringify({ 
            fullNameError: fullNameError,
            emailError: emailError,
            password_confirmError: password_confirmError,
            passwordError: passwordError
         }))*/
    }
    if (userTypeError  != "") {
        return res.status(422).end(JSON.stringify({ 
            error : userTypeError
         }))
    }
    const email = req.body.email
    const password = req.body.password
    const enabled = true
    const fullname = req.body.fullname

    const role = await Role.findOne({role:user_type})
     /*  const user = await User.findOne({email:'test@test.com'})
   
   */
  //console.log(role._id)
    bcrypt.hash(password, 12)
        .then(hashedPassword =>{
            const user = new User({
                fullname : fullname,
                email : email,
                password : hashedPassword,
                enabled : enabled,
                user_type : user_type,
                roles:[new DBRef('roles', role._id, undefined)]
                })
                console.log(user)
            return    user.save()
        }).then(user =>{
          var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 600 //10min  //86400 // 24 hours
          });
          return res.status(200).send({
            id: user._id,
            fullname: user.fullname,
            enabled: user.enabled,
            email: user.email,
            role: user.user_type,
            accessToken: token
          });
            //return res.status(200).end(JSON.stringify({ "message": "account created with success !!" }));

        })
        .catch(err => console.log(err))
    //console.log(email, password, enabled, fullname, user_type )

   
}


exports.login = (req, res) => {
    User.findOne({
      email: req.body.email
    })
      .exec((err, user) => {
        console.log("user::s:",user)

      if (!user) {
          return res.status(401).json({ message: "User Not found." });
        }
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
  
        
        
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsValid) {
          return res.status(401).json({
              message: "Invalid Password!"
          });
        }

        var token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 600 //10min  //86400 // 24 hours
        });
        res.status(200).send({
          id: user._id,
          fullname: user.fullname,
          enabled: user.enabled,
          email: user.email,
          role: user.user_type,
          accessToken: token
        });
      });
  };