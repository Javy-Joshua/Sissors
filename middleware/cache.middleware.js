const Cache = require('../helpers/cache.helper.js')

const cacheMiddleWare = (req, res, next) => {
    const { OriginalUrl } = req.body;
    

    const cacheKey = `Urls-${OriginalUrl}`;
    console.log(`cacheKey is ${cacheKey}`);
    const cachedUrl = Cache.get(cacheKey)
    if (cachedUrl) {
      console.log("cache hit");

      
    return res.render("QRGen", {
    OriginalUrl: cachedUrl.OriginalUrl,
    ShortUrl: cachedUrl.ShortUrl,
    qr_code: " "
    });
      
    }
    next()
}

module.exports = {
    cacheMiddleWare
}
