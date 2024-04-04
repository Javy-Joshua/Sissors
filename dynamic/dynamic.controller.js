const UrlModel = require("../models/url.model");
const qrcode = require("qrcode");
const UserModel = require("../models/user.model");
// const axios = require('axios')
const IPGeolocationAPI = require("ip-geolocation-api-javascript-sdk");
const GeolocationParams = require("ip-geolocation-api-javascript-sdk");
const { date } = require("joi");
const geoip = require("geoip-lite");
const satelize = require("satelize");



const ClickCount = async (req, res) => {
  try {
    const url = await UrlModel.findOne({ ID: req.params.urlid });
    console.log("url is ", url);
    // console.log("request object is ", req);
    if (url) {
      await UrlModel.updateOne(
        { ID: req.params.urlid },
        { $inc: { ClickCount: 1 } }
      );

      // Retrieve location data based on the user's IP address
      const ip = req.ip;
      const ipv4Address = ip.includes("::ffff:") ? ip.split("::ffff:")[1] : ip;
      console.log("ip address is", ip);
      console.log("ipv4Address address is", ipv4Address);

      satelize.satelize({ ip: ipv4Address }, function (err, payload) {
        if (err) {
          console.error("Error fetching location:", err);
          throw new Error("Failed to fetch location data");
        }
        console.log(payload);

        //update location array in the database
        UrlModel.updateOne(
          { ID: req.params.urlid },
          { $push: { ClickLocation: payload } }
        )
          .then(() => {
            return res.redirect(302, url.OriginalUrl);
          })
          .catch((error) => {
            console.error("Error updating location:", error);
            throw new Error("Failed to update location data");
          });
      });
    } else {
      res.status(404).json({
        message: "Not Found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server not found",
      data: null,
    });
  }
};



const QrCode = async (req, res) => {
  const { ShortlUrl, OriginalUrl } = req.body;

  let opts = {
    errorCorrectionLevel: "H",
    type: "image/jpeg",
    quality: 0.3,
    margin: 1.2,
    color: {
      dark: "#EC9316",
      light: "#FFFF",
    },
    width: 250,
  };

  if (ShortlUrl) {
    qrcode.toDataURL(ShortlUrl, opts, (err, src) => {
      res.render("QRGen", {
        OriginalUrl: OriginalUrl,
        ShortUrl: ShortlUrl,
        qr_code: src,
      });
    });
  } else {
    res.status(400).json({
      message: "Short Url not found",
    });
  }
};

const UpdateUrl = async (req, res) => {
  const { ShortlUrl, OriginalUrl } = req.body;
  try {
    const url = await UrlModel.findOne({ ShortUrl: ShortlUrl });
    if (url) {
      await UrlModel.updateOne({
        OriginalUrl: OriginalUrl,
      });
      return res.render("QRGen", {
        OriginalUrl: OriginalUrl,
        ShortlUrl: ShortlUrl,
        qr_code: "",
      });
    } else {
      res.status(400).json({
        message: "Not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const GetAnalytics = async (req, res) => {
  try {
    // const userId = req.params.id; // assuming user's id in the roue params
    const userId = res.locals.user._id
    console.log(userId);
    const user = await UserModel.find({ _id: userId });

    if (!user) {
      return res.status(404).json({
        message: "User not Found",
        data: null,
      });
    }

    const urls = await UrlModel.find({ user_id: userId });
    // console.log(urls);

    //check if the user is the owner of the urls
    if (urls.length === 0 || urls[0].user_id.toString() !== userId) {
      return res.status(401).json({
        message: "You can only access your own custom url",
      });
    }

    res.render("analytics", {
      urls
    });

    // res.status(200).json(urls)
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      data: null,
    });
  }
};

module.exports = {
  ClickCount,
  QrCode,
  UpdateUrl,
  GetAnalytics,
};




// OriginalUrl: urls.OriginalUrl,
//       ShortUrl: urls.ShortUrl,
//       ClickCount: urls.ClickCount,
//       ClickLocation: urls.ClickLocation,
//       date: urls.date,