const UrlModel = require("../models/url.model");
const uuid = require("uuid");
// const { nanoid } = require("nanoid");
const Cache = require("../helpers/cache.helper");
const HistoryModel = require("../models/history.model");
require("dotenv").config();

const CreateShortUrl = async (req, res) => {
  const { OriginalUrl } = req.body;
  console.log(OriginalUrl);
  // console.log('req is ',req)
  const base = process.env.BASE;
  // console.log("base value is ",base)
  const ID = uuid.v4();
  if (!OriginalUrl) {
    res.status(400).json({
      message: "Invalid Original Url ",
      data: null,
    });
  }

  try {
    const cacheKey = `Urls-${OriginalUrl}`;
    // console.log(`cacheKey is ${cacheKey}`);
    const userId = res.locals.user._id;
    // console.log("user id from controller",userId)
    let url = await UrlModel.findOne({ OriginalUrl, user_id: userId });
    

    if (url) {
      res.render("QRGen", {
        OriginalUrl: url.OriginalUrl,
        ShortUrl: url.ShortUrl,
        qr_code: "",
      });
    } else {
      const ShortUrl = `${base}/nav/${ID}`;
      url = new UrlModel({
        OriginalUrl,
        ShortUrl: ShortUrl,
        ClickCount: 0,
        user_id: userId,
        ID,
        date: new Date(),
      });
      await url.save();

    //   Create history entry
      await HistoryModel.create({
        OriginalUrl: url.OriginalUrl,
        ShortUrl: url.ShortUrl,
        user_id: userId,
        date: url.date,
        });

      res.render("QRGen", {
        OriginalUrl: url.OriginalUrl,
        ShortUrl: url.ShortUrl,
        qr_code: "",
      });

      // return res.status(200).json({
      //   OriginalUrl: url.OriginalUrl,
      //   ShortUrl: url.ShortUrl,
      //   qr_code: "",
      // });
    }

    console.log("cache miss");
    const TTL_1_DAY = 60 * 60 * 24;
    Cache.set(cacheKey, url, TTL_1_DAY);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      data: null,
    });
  }
};

module.exports = {
  CreateShortUrl,
};
