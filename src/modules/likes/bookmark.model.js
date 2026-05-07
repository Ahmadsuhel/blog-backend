const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('../users/user.model');
const Post = require('../posts/post.model');

const Bookmark = sequelize.define(
  'Bookmark',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: 'bookmarks',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'postId'],
      },
    ],
  }
);

User.hasMany(Bookmark, { foreignKey: 'userId', onDelete: 'CASCADE' });
Bookmark.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(Bookmark, { foreignKey: 'postId', onDelete: 'CASCADE' });
Bookmark.belongsTo(Post, { foreignKey: 'postId' });

module.exports = Bookmark;