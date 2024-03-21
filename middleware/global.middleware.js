
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config()

const bearerTokenAuth = async (req, res, next) => {
  try {
    let token;
    let tokenHeader = req.header.Authorization || req.headers.authorization;
    console.log('token header is',tokenHeader)

    if (tokenHeader && tokenHeader.includes("Bearer")) {
      token = tokenHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
          res.status(401);
          throw new Error("User is not authorized");
        }
        console.log("decode", decode);
        req.user = decode;
        console.log('user request is',req.user)

        next();
      });
      if (!token) {
        res.status(401);
        throw new Error(`Token is required`);
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};


const ensureLogin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    // console.log(token)
    if (!token) {
      res.redirect("/views/login")
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET)
    res.locals.user= decoded
    user = res.locals.user
    // console.log('user is ', user)
    next()
  } catch (error) {
    console.error('error message is ',error.message)
  }
}

module.exports = {
  bearerTokenAuth,
  ensureLogin
};
