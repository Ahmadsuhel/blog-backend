// const express = require('express');
// const cookieParser = require('cookie-parser');
// const swaggerUi = require('swagger-ui-express');
// const swaggerSpec = require('./config/swagger');
// const errorHandler = require('./middlewares/errorHandler');

// const app = express();
// app.use(helmet());

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:4200',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );

// app.use(express.json());
// app.use(cookieParser());

// // Swagger UI
// app.use(
//   '/api/docs',
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerSpec, {
//     swaggerOptions: { persistAuthorization: true },
//     customSiteTitle: 'Blog API Docs',
//   })
// );

// // Routes
// app.use('/api/v1/auth', require('./modules/auth/auth.routes'));
// app.use('/api/v1/users', require('./modules/users/user.routes'));
// app.use('/api/v1/posts', require('./modules/posts/post.routes'));
// app.use('/api/v1/comments', require('./modules/comments/comment.routes'));
// app.use('/api/v1/tags', require('./modules/tags/tag.routes'));
// app.use('/api/v1/search', require('./modules/search/search.routes'));
// app.use('/api/v1/likes', require('./modules/likes/like.routes'));
// app.use('/api/v1/notifications', require('./modules/notifications/notification.routes'));
// app.use('/api/v1/ai', require('./modules/ai/ai.routes'));
// app.use('/api/v1/media', require('./modules/media/media.routes'));
// app.use('/api/v1/email', require('./modules/email/email.routes'));
// app.use('/api/v1/analytics', require('./modules/analytics/analytics.routes'));
// const {
//   generalLimiter,
//   authLimiter,
//   aiLimiter,
//   uploadLimiter,
// } = require('./middlewares/rateLimiter');

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ status: 'ok', message: 'Server is running' });
// });

// // 404
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: 'Route not found' });
// });

// // Global error handler — must be last
// app.use(errorHandler);

// module.exports = app;




require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const errorHandler = require('./middlewares/errorHandler');
const {
  generalLimiter,
  authLimiter,
  aiLimiter,
  uploadLimiter,
} = require('./middlewares/rateLimiter');

// Initialize passport
const passport = require('./config/passport');

const app = express();

// ── Security headers ─────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Parsing ──────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Logging ──────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Passport ─────────────────────────────
app.use(passport.initialize());

// ── General rate limit on all routes ─────
app.use('/api/', generalLimiter);

// ── Swagger UI ───────────────────────────
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'Blog API Docs',
  })
);

// ── Routes ───────────────────────────────
app.use('/api/v1/auth',          authLimiter, require('./modules/auth/auth.routes'));
app.use('/api/v1/users',                      require('./modules/users/user.routes'));
app.use('/api/v1/posts',                      require('./modules/posts/post.routes'));
app.use('/api/v1/comments',                   require('./modules/comments/comment.routes'));
app.use('/api/v1/tags',                       require('./modules/tags/tag.routes'));
app.use('/api/v1/search',                     require('./modules/search/search.routes'));
app.use('/api/v1/likes',                      require('./modules/likes/like.routes'));
app.use('/api/v1/notifications',              require('./modules/notifications/notification.routes'));
app.use('/api/v1/ai',            aiLimiter,   require('./modules/ai/ai.routes'));
app.use('/api/v1/media',         uploadLimiter,require('./modules/media/media.routes'));
app.use('/api/v1/email',                      require('./modules/email/email.routes'));
app.use('/api/v1/analytics',                  require('./modules/analytics/analytics.routes'));

// ── Health check ─────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── 404 handler ──────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// ── Global error handler ─────────────────
app.use(errorHandler);

module.exports = app;