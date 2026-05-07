const slugify = require('slugify');
const { Op } = require('sequelize');
const { Tag, PostTag } = require('./tag.model');
const Post = require('../posts/post.model');
const User = require('../users/user.model');
const { ApiError } = require('../../utils/ApiResponse');
const { getPagination, getPaginationMeta } = require('../../utils/pagination');

// Create a new tag
const createTag = async ({ name, description }) => {
  const slug = slugify(name, { lower: true, strict: true });

  const existing = await Tag.findOne({ where: { slug } });
  if (existing) throw new ApiError(409, 'Tag already exists');

  const tag = await Tag.create({ name, slug, description });
  return tag;
};

// Get all tags
const getAllTags = async (query) => {
  const { page, limit, offset } = getPagination(query);

  const { count, rows } = await Tag.findAndCountAll({
    order: [['postsCount', 'DESC']],
    limit,
    offset,
  });

  return {
    tags: rows,
    meta: getPaginationMeta(count, page, limit),
  };
};

// Get single tag with its posts
const getTagBySlug = async (slug, query) => {
  const tag = await Tag.findOne({ where: { slug } });
  if (!tag) throw new ApiError(404, 'Tag not found');

  const { page, limit, offset } = getPagination(query);

  const { count, rows } = await Post.findAndCountAll({
    where: { status: 'published' },
    include: [
      {
        model: Tag,
        as: 'tags',
        where: { id: tag.id },
        attributes: [],
        through: { attributes: [] },
      },
      {
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'avatar'],
      },
    ],
    order: [['publishedAt', 'DESC']],
    limit,
    offset,
  });

  return {
    tag,
    posts: rows,
    meta: getPaginationMeta(count, page, limit),
  };
};

// Attach tags to a post — creates tags if they don't exist
const addTagsToPost = async (postId, tagNames, authorId) => {
  const post = await Post.findByPk(postId);
  if (!post) throw new ApiError(404, 'Post not found');

  if (post.authorId !== authorId) {
    throw new ApiError(403, 'You are not allowed to tag this post');
  }

  if (!Array.isArray(tagNames) || tagNames.length === 0) {
    throw new ApiError(400, 'Provide at least one tag name');
  }

  if (tagNames.length > 5) {
    throw new ApiError(400, 'Maximum 5 tags allowed per post');
  }

  // Find or create each tag
  const tags = await Promise.all(
    tagNames.map(async (name) => {
      const slug = slugify(name.trim(), { lower: true, strict: true });
      const [tag] = await Tag.findOrCreate({
        where: { slug },
        defaults: { name: name.trim(), slug },
      });
      return tag;
    })
  );

  // Remove old tags then set new ones
  await post.setTags(tags);

  // Update postsCount for each tag
  await Promise.all(
    tags.map(async (tag) => {
      const count = await tag.countPosts({ where: { status: 'published' } });
      await tag.update({ postsCount: count });
    })
  );

  // Return post with updated tags
  const updated = await Post.findByPk(postId, {
    include: [{ model: Tag, as: 'tags', through: { attributes: [] } }],
  });

  return updated;
};

// Remove all tags from a post
const removeTagsFromPost = async (postId, authorId) => {
  const post = await Post.findByPk(postId);
  if (!post) throw new ApiError(404, 'Post not found');

  if (post.authorId !== authorId) {
    throw new ApiError(403, 'You are not allowed to modify this post');
  }

  await post.setTags([]);
  return { message: 'Tags removed successfully' };
};

// Delete a tag — admin only
const deleteTag = async (tagId) => {
  const tag = await Tag.findByPk(tagId);
  if (!tag) throw new ApiError(404, 'Tag not found');
  await tag.destroy();
};

module.exports = {
  createTag,
  getAllTags,
  getTagBySlug,
  addTagsToPost,
  removeTagsFromPost,
  deleteTag,
};