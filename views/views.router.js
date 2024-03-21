const express = require('express')
const userService = require('../users/users.services')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const dynamicService = require('../dynamic/dynamic.controller')

require('dotenv').config()

const router = express.Router()
router.use(cookieParser())

router.get('/signup', async (req, res) => {
    res.render('signUp')
})

router.get('/index', (req, res) => {
    res.render("login");
})

router.post('/login', async (req, res) => {
    const response = await userService.Login({ email: req.body.email, password: req.body.password })  
    console.log(response, req)

    if (response.code === 200) {
        res.redirect('/views/dashboard')
    } else {
        console.log('error logging in')
        res.render('login')
    }
})

// router.use(async (req, res, next) => {
    
//     const token = req.cookies.jwt

//     if (token) {
//         try {
//             const decodedValue = await jwt.verify(token, process.env.JWT_SECRET)
            
//             res.locals.user = decodedValue
//             console.log(res.locals.user)
//             next()
//         } catch (error) {
//             res.redirect('login')
//         }
//     } else {
//         res.redirect('login')
//     }
// })

router.get("/QRGen", (req, res) => {
  res.render("QRGen", {
    user: res.locals.user,
    OriginalUrl: "",
    ShortUrl: "",
    qr_code: "",
  });
});

router.get('/logout', (req, res) => {
    res.clearCookie('jwt')
   return res.redirect('/views/index')
})

router.get('/dashboard', (req, res) => {
    // console.log({ user: res.locals.user})
   return  res.render("dashboard", { user: res.locals.user });
})

router.get('/QRCode', (req, res) => {
    // console.log({ user: res.locals.user})
   return  res.render("QrGen", { user: res.locals.user });
})

router.get('/myurl', async( req, res) => {
    const response = await dynamicService.GetAnalytics()
    res.render("analytics", {
      user: res.locals.user,
      urls: response.data.urls
    });
})



module.exports = router 