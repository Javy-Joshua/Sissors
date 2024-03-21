const UrlModel = require("../models/url.model");
const qrcode = require("qrcode");
const UserModel = require("../models/user.model");
// const axios = require('axios')
const IPGeolocationAPI = require("ip-geolocation-api-javascript-sdk");
const GeolocationParams = require("ip-geolocation-api-javascript-sdk");
const { date } = require("joi");

const ipgeolocationApi = new IPGeolocationAPI(
  "3937e2d5b8514e3081e922de0a71d1b9",
  false
);

// const ClickCount = async (req, res) => {
//   try {
//     const url = await UrlModel.findOne({ ID: req.params.urlid });
//     console.log(req.params);
//     if (url) {
//       await UrlModel.updateOne(
//         { ID: req.params.urlid },
//         { $inc: { ClickCount: 1 } }
//       );

//       // Retrieve location data based on the user's IP address
//       const ipAddress = req.ip;
//       const location = await getLocation(ipAddress);

//       // Update location array in the database
//       await UrlModel.updateOne(
//         { ID: req.params.urlid },
//         { $push: { ClickLocation: location } }
//       );

//       return res.redirect(302, url.OriginalUrl);
//     } else {
//       res.status(404).json({
//         message: "Not Found",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Server not found",
//       data: null,
//     });
//   }
// };

// Function to retrieve location data based on IP address

const ClickCount = async (req, res) => {
  try {
    const url = await UrlModel.findOne({ ID: req.params.urlid });
    console.log(req.params);
    if (url) {
      await UrlModel.updateOne(
        {
          ID: req.params.urlid,
        },
        {
          $inc: { ClickCount: 1 },
        }
      );

      // Retrieve location data based on the user's IP address
      //  const ipAddress = req.ip
      const ipAddress = req.connection.remoteAddress;
      console.log("ip address is", ipAddress);
      const location = await getLocation(ipAddress);

      //update location array in the database
      await UrlModel.updateOne(
        { ID: req.params.urlid },
        { $push: { ClickLocation: location } }
      );

      return res.redirect(302, url.OriginalUrl);
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

async function getLocation(ipAddress) {
  try {
    const geolocationParams = new GeolocationParams();
    geolocationParams.setIPAddress(ipAddress);
    // Fetch location data using IP Geolocation API
    const response = await ipgeolocationApi.getGeolocation("json", ipAddress);
    console.log(json);
    // Extract necessary location information from the response
    const location = {
      country: response.country_name,
      region: response.region_name,
      city: response.city,
      latitude: response.latitude,
      longitude: response.longitude,
    };
    return location;
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
}

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
    console.log(urls);

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