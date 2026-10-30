const rateLimit = require('express-rate-limit');

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,             // 20 requests per minute per IP
  message: {
    error: 'धेरै सन्देश पठाउनुभयो! एकछिन पर्खनुस् बाबु — बाजे पनि सास फेर्नु पर्छ! 😄'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  }
});

module.exports = { chatLimiter };
