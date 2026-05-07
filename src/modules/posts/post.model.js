const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('../users/user.model');

const Post = sequelize.define(
  'Post',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(300),
      allowNull: false,
      validate: {
        len: {
          args: [5, 300],
          msg: 'Title must be between 5 and 300 characters',
        },
      },
    },
    slug: {
      type: DataTypes.STRING(350),
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [10],
          msg: 'Content must be at least 10 characters',
        },
      },
    },
    excerpt: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'published'),
      defaultValue: 'draft',
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    readingTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'posts',
    timestamps: true,
  }
);

// Associations
User.hasMany(Post, { foreignKey: 'authorId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

module.exports = Post;