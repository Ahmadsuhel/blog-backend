const rateLimit = require('express-rate-limit');

// General API limit — 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth limit — 10 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI limit — 20 requests per hour (Gemini free tier protection)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'AI request limit reached, please try again after 1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Upload limit — 30 uploads per hour
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Upload limit reached, please try again after 1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  aiLimiter,
  uploadLimiter,
};