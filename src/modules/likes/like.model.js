const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('../users/user.model');
const Post = require('../posts/post.model');

const Like = sequelize.define(
  'Like',
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
    tableName: 'likes',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'postId'],
      },
    ],
  }
);

User.hasMany(Like, { foreignKey: 'userId', onDelete: 'CASCADE' });
Like.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(Like, { foreignKey: 'postId', onDelete: 'CASCADE' });
Like.belongsTo(Post, { foreignKey: 'postId' });

module.exports = Like;