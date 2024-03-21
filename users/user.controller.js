const UserModel = require('../models/user.model')
const jwt = require("jsonwebtoken")
const logger = require('../logger/logger')
const userService = require('./users.services')
require("dotenv").config()

const CreateUser = async (req, res) => {
    try {
        const userFromRequest = req.body

        const existingUser = await UserModel.findOne({
            emai: userFromRequest.email
        })

        if (existingUser){
            return res.status(409).json({
                message: "user already created"
            })
        }

        const user = await UserModel.create({
            name: userFromRequest.name,
            email: userFromRequest.email,
            password: userFromRequest.password,
        })

        // return res.status(201).json({
        //     message: "User successfully created", user,
        // })

        return res.redirect('/views/index')

    } catch (error) {
        logger.error(error.message)
        return res.status(500).json({
            message: "Server Error",
            data: null,
        })

    }
}

const Login = async (req, res) => {
    try {
        const response = await userService.Login({ email:req.body.email, password:req.body.password} )
        if(response.code == 200) {
            res.cookie('jwt', response.data.token, { maxAge: 2 * 60 * 60 * 1000})
            res.redirect('/views/dashboard/')
        }  else if (response.code == 404) {
            res.redirect('views/index')
        }else if (response.code == 422) {
            res.redirect('views/index')
        } 


   

    } catch (error) {
        logger.error(error.message)
        return res.status(500).json({
            message: "Server Error",
            data: null
        })
    
    }
}


(module.exports = {
  CreateUser,
  Login,
})



//  , { userId: userId };


     
    //     const userFromRequest = req.body 
    //     const user = await UserModel.findOne({
    //         email: userFromRequest.email
    //     })

    //     if (!user) {
    //         return res.status(404).json({
    //             message: "user not found"
    //         })
    //     }

    //     const IsValidPassword = await user.IsValidPassword(userFromRequest.password)

    //     if(!IsValidPassword) {
    //         return res.status(422).json({
    //             message: "Email or password is not correct"
    //         })
    //     }

    //      const token = await jwt.sign(
    //        { email: user.email, _id: user._id },
    //        process.env.JWT_SECRET,
    //        { expiresIn: "3h" }
    //      );
    //         // res.cookie('jwt', process.env.JWT_SECRET)


    //     //  console.log(token)
         
    //     //  return res.status(200).json({
    //     //     message: "login successful",
    //     //     user, token
    //     //  })

    //    return ()