const express = require("express")
const controller = require('./dynamic.controller')
const globalMiddleware = require("../middleware/global.middleware");

const router = express.Router()

// router.use(globalMiddleware.bearerTokenAuth)

router.get("/nav/:urlid", controller.ClickCount)

router.use(globalMiddleware.ensureLogin);

router.post("/QRCode", controller.QrCode)

router.post("/update", controller.UpdateUrl)

router.get('/myurl', controller.GetAnalytics)

router.get("/QRGen", (req, res) => {
  res.status(200).render("QRGen", {
    OriginalUrl: "",
    ShortUrl: "",
    qr_code: "",
  });
});


module.exports = router