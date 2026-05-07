require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/database');
require('./src/modules/users/user.model');
require('./src/modules/users/follow.model');
require('./src/modules/users/refreshToken.model');
require('./src/modules/posts/post.model');
require('./src/modules/comments/comment.model');
require('./src/modules/likes/like.model');
require('./src/modules/likes/bookmark.model');

// Import all models so sequelize.sync() picks them up
require('./src/modules/users/user.model');
require('./src/modules/users/refreshToken.model');
require('./src/modules/tags/tag.model');

require('./src/modules/notifications/notification.model');
require('./src/modules/analytics/analytics.model');

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Swagger docs at http://localhost:${PORT}/api/docs`);
  });
};

start();