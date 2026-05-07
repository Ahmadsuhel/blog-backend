const slugify = require('slugify');
const { Op } = require('sequelize');
const Post = require('./post.model');
const User = require('../users/user.model');
const { ApiError } = require('../../utils/ApiResponse');
const { getPagination, getPaginationMeta } = require('../../utils/pagination');

// Calculate reading time from content
const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Generate a unique slug
const generateSlug = async (title) => {
  let slug = slugify(title, { lower: true, strict: true });
  const existing = await Post.findOne({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }
  return slug;
};

// Create a new post
const createPost = async (data, authorId) => {
  const slug = await generateSlug(data.title);
  const readingTime = calculateReadingTime(data.content);

  // Auto-generate excerpt if not provided
  const excerpt = data.excerpt ||
    data.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';

  const post = await Post.create({
    ...data,
    slug,
    readingTime,
    excerpt,
    authorId,
    publishedAt: data.status === 'published' ? new Date() : null,
  });

  return post;
};

// Get all published posts with pagination
const getAllPosts = async (query) => {
  const { page, limit, offset } = getPagination(query);

  const { count, rows } = await Post.findAndCountAll({
    where: { status: 'published' },
    include: [
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
    posts: rows,
    meta: getPaginationMeta(count, page, limit),
  };
};

// Get single post by slug — also increments view count
const getPostBySlug = async (slug) => {
  const post = await Post.findOne({
    where: { slug, status: 'published' },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'avatar', 'bio'],
      },
    ],
  });

  if (!post) throw new ApiError(404, 'Post not found');

  // Increment views
  await post.increment('views');

  return post;
};

// Get all posts by the logged-in author (drafts + published)
const getMyPosts = async (authorId, query) => {
  const { page, limit, offset } = getPagination(query);

  const whereClause = { authorId };
  if (query.status) whereClause.status = query.status;

  const { count, rows } = await Post.findAndCountAll({
    where: whereClause,
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return {
    posts: rows,
    meta: getPaginationMeta(count, page, limit),
  };
};

// Update a post — only the author can update
const updatePost = async (postId, data, authorId) => {
  const post = await Post.findByPk(postId);

  if (!post) throw new ApiError(404, 'Post not found');
  if (post.authorId !== authorId) {
    throw new ApiError(403, 'You are not allowed to update this post');
  }

  // Regenerate slug if title changed
  if (data.title && data.title !== post.title) {
    data.slug = await generateSlug(data.title);
  }

  // Recalculate reading time if content changed
  if (data.content) {
    data.readingTime = calculateReadingTime(data.content);
  }

  // Set publishedAt when publishing for the first time
  if (data.status === 'published' && post.status === 'draft') {
    data.publishedAt = new Date();
  }

  await post.update(data);
  return post;
};

// Delete a post — only the author can delete
const deletePost = async (postId, authorId, userRole) => {
  const post = await Post.findByPk(postId);

  if (!post) throw new ApiError(404, 'Post not found');

  // Admin can delete any post, authors can only delete their own
  if (userRole !== 'admin' && post.authorId !== authorId) {
    throw new ApiError(403, 'You are not allowed to delete this post');
  }

  await post.destroy();
};

module.exports = {
  createPost,
  getAllPosts,
  getPostBySlug,
  getMyPosts,
  updatePost,
  deletePost,
};