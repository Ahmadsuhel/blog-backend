const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('../users/user.model');
const Post = require('../posts/post.model');

const PostView = sequelize.define(
  'PostView',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    // null means anonymous visitor
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // how far they scrolled — 0 to 100
    scrollDepth: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0, max: 100 },
    },
    // seconds spent reading
    timeSpent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // did they finish reading
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'post_views',
    timestamps: true,
  }
);

Post.hasMany(PostView, { foreignKey: 'postId', onDelete: 'CASCADE' });
PostView.belongsTo(Post, { foreignKey: 'postId' });

User.hasMany(PostView, { foreignKey: 'userId', onDelete: 'SET NULL' });
PostView.belongsTo(User, { foreignKey: 'userId' });

module.exports = PostView;