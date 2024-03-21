const express = require('express')
const controller = require('./user.controller')
const middleware = require('./user.middleware')


const router = express.Router()


router.post('/signup', middleware.ValidateUserCreation, controller.CreateUser)

router.post('/login', middleware.LoginValidation, controller.Login)

module.exports = router


// <%= userId %>