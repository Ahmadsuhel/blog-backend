const { Op } = require('sequelize');
const Post = require('../posts/post.model');
const User = require('../users/user.model');
const { Tag } = require('../tags/tag.model');
const { ApiError } = require('../../utils/ApiResponse');
const { getPagination, getPaginationMeta } = require('../../utils/pagination');

const searchPosts = async (query) => {
  const { q, tag, author } = query;
  const { page, limit, offset } = getPagination(query);

  if (!q && !tag && !author) {
    throw new ApiError(400, 'Provide at least one search parameter: q, tag, or author');
  }

  const whereClause = { status: 'published' };
  const includeClause = [
    {
      model: User,
      as: 'author',
      attributes: ['id', 'name', 'avatar'],
    },
    {
      model: Tag,
      as: 'tags',
      through: { attributes: [] },
      attributes: ['id', 'name', 'slug'],
    },
  ];

  // Full-text search on title and content
  if (q) {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${q}%` } },
      { content: { [Op.iLike]: `%${q}%` } },
      { excerpt: { [Op.iLike]: `%${q}%` } },
    ];
  }

  // Filter by tag slug
  if (tag) {
    includeClause[1] = {
      model: Tag,
      as: 'tags',
      through: { attributes: [] },
      attributes: ['id', 'name', 'slug'],
      where: { slug: tag },
      required: true,
    };
  }

  // Filter by author name
  if (author) {
    includeClause[0] = {
      model: User,
      as: 'author',
      attributes: ['id', 'name', 'avatar'],
      where: { name: { [Op.iLike]: `%${author}%` } },
      required: true,
    };
  }

  const { count, rows } = await Post.findAndCountAll({
    where: whereClause,
    include: includeClause,
    order: [['publishedAt', 'DESC']],
    limit,
    offset,
    distinct: true,
  });

  return {
    query: { q, tag, author },
    posts: rows,
    meta: getPaginationMeta(count, page, limit),
  };
};

module.exports = { searchPosts };