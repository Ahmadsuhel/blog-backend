const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const Post = require('../posts/post.model');

const Tag = sequelize.define(
  'Tag',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [2, 50],
          msg: 'Tag name must be 2-50 characters',
        },
      },
    },
    slug: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    postsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: 'tags',
    timestamps: true,
  }
);

// Junction table — PostTag (many-to-many)
const PostTag = sequelize.define(
  'PostTag',
  {
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'posts', key: 'id' },
      onDelete: 'CASCADE',
    },
    tagId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'tags', key: 'id' },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'post_tags',
    timestamps: false,
  }
);

// Many-to-many association
Post.belongsToMany(Tag, { through: PostTag, foreignKey: 'postId', as: 'tags' });
Tag.belongsToMany(Post, { through: PostTag, foreignKey: 'tagId', as: 'posts' });

module.exports = { Tag, PostTag };