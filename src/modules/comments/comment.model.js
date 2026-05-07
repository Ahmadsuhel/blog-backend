const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('../users/user.model');
const Post = require('../posts/post.model');

const Comment = sequelize.define(
  'Comment',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [1, 2000],
          msg: 'Comment must be between 1 and 2000 characters',
        },
      },
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
    },
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isEdited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'comments',
    timestamps: true,
    // Disable alter completely for this model
    indexes: [],
  }
);

// Associations
Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

User.hasMany(Comment, { foreignKey: 'authorId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Comment.hasMany(Comment, { foreignKey: 'parentId', as: 'replies' });
Comment.belongsTo(Comment, { foreignKey: 'parentId', as: 'parent' });

module.exports = Comment;