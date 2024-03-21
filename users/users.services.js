const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const logger = require('../logger/logger');

const Login = async ({ email, password }) => {
    logger.info('[CreateUser] => login process started')
    const userFromRequest = { email, password }

    const user = await UserModel.findOne({
        email: userFromRequest.email,
    });

    if (!user) { 
        return {
            message: 'User not found',
            code: 404
        }
    }

    const validPassword = await user.IsValidPassword(userFromRequest.password)

    if (!validPassword) {
        return {
            message: 'Email or password is not correct',
            code: 422,
        }
    }

    const token = await jwt.sign({ 
        email: user.email, 
        _id: user._id, }, 
        process.env.JWT_SECRET, 
        { expiresIn: '3h' })

        return {
            message: 'Login successful',
            code: 200,
            data: {
                user: user,
                token: token
            }
        }
}

module.exports = {
    Login
}