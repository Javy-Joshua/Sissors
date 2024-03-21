const Joi = require('joi')

// const validateUrlRegExp = function (value) {
//   return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i.test(
//     value
//   );
// };

const validateUrlRegExp =
  /^(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i;


// code: Joi.string().pattern(customRegExp).required(),

const validateurlJoi = async (req, res, next) => {
    try {
        const schema = Joi.object({
          OriginalUrl: Joi.string().pattern(validateUrlRegExp).required(),
          
          // ShortUrl: Joi.string().allow(' ').optional()
        }).unknown(true);

        await schema.validateAsync(req.body, {abortEarly: true})

        next()
    } catch (error) {
        return res.status(422).json({
          message: error.message,
          success: false,
        });
    }
}

module.exports = {
  validateurlJoi,
};





