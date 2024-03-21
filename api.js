const express = require('express')
const UserRouter = require('./users/user.route')
const DynamicRouter = require('./dynamic/dynamic.router')
const UrlRouter = require('./shortUrl/url.router')
const viewRouter = require('./views/views.router')
const rateLimit = require("express-rate-limit");
const cookieParser = require('cookie-parser')
const ejs = require('ejs')
const morgan = require('morgan')

const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  limit: 200,
  standardHeaders: "draft-7",
});

//  Apply the rate limiting middleware to all request
app.use(limiter);


app.set('view engine', "ejs")
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(morgan('dev'))


app.use("/home", (req, res) => {
    res.status(200).render("Home")
})
// app.use("/dashboard", (req, res) => {
//     res.status(200).render("dashboard")
// })

app.use("/users", UserRouter);
app.use("/views", viewRouter);

app.use(cookieParser());


app.use("/", DynamicRouter);
app.use("/api", UrlRouter);



app.get('*', (req, res) => {
    return res.render("404", {
        error: "Route not found"
    })
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.render("404", {
        error: "Route not found"
    })
})

module.exports = app