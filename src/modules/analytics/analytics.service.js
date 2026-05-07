const { Op, fn, col, literal } = require('sequelize');
const { sequelize } = require('../../config/database');
const PostView = require('./analytics.model');
const Post = require('../posts/post.model');
const User = require('../users/user.model');
const Like = require('../likes/like.model');
const Comment = require('../comments/comment.model');
const { ApiError } = require('../../utils/ApiResponse');

// Track a post view
const trackView = async ({ postId, userId, ipAddress, userAgent }) => {
  const post = await Post.findByPk(postId);
  if (!post) throw new ApiError(404, 'Post not found');

  // Prevent duplicate views from same user within 1 hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const where = { postId, createdAt: { [Op.gt]: oneHourAgo } };
  if (userId) {
    where.userId = userId;
  } else {
    where.ipAddress = ipAddress;
  }

  const existing = await PostView.findOne({ where });
  if (existing) return { counted: false };

  await PostView.create({ postId, userId, ipAddress, userAgent });

  // Increment post views counter
  await post.increment('views');

  return { counted: true };
};

// Update scroll depth and time spent
const updateEngagement = async ({ postId, userId, scrollDepth, timeSpent }) => {
  const where = { postId };
  if (userId) where.userId = userId;

  const view = await PostView.findOne({
    where,
    order: [['createdAt', 'DESC']],
  });

  if (!view) return;

  await view.update({
    scrollDepth: Math.max(view.scrollDepth, scrollDepth),
    timeSpent: Math.max(view.timeSpent, timeSpent),
    completed: scrollDepth >= 80,
  });
};

// Get stats for a single post — for the author
const getPostStats = async (postId, authorId) => {
  const post = await Post.findByPk(postId);
  if (!post) throw new ApiError(404, 'Post not found');

  if (post.authorId !== authorId) {
    throw new ApiError(403, 'You can only view stats for your own posts');
  }

  const totalViews = await PostView.count({ where: { postId } });
  const uniqueViews = await PostView.count({
    where: { postId, userId: { [Op.ne]: null } },
    distinct: true,
    col: 'userId',
  });

  const avgScrollDepth = await PostView.findOne({
    where: { postId },
    attributes: [[fn('AVG', col('scrollDepth')), 'avgScroll']],
    raw: true,
  });

  const avgTimeSpent = await PostView.findOne({
    where: { postId },
    attributes: [[fn('AVG', col('timeSpent')), 'avgTime']],
    raw: true,
  });

  const completionRate = await PostView.findOne({
    where: { postId },
    attributes: [
      [
        literal(
          'ROUND(COUNT(CASE WHEN "completed" = true THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2)'
        ),
        'completionRate',
      ],
    ],
    raw: true,
  });

  const likesCount = await Like.count({ where: { postId } });
  const commentsCount = await Comment.count({ where: { postId } });

  return {
    postId,
    title: post.title,
    totalViews,
    uniqueViews,
    likesCount,
    commentsCount,
    avgScrollDepth: Math.round(avgScrollDepth?.avgScroll || 0),
    avgTimeSpent: Math.round(avgTimeSpent?.avgTime || 0),
    completionRate: parseFloat(completionRate?.completionRate || 0),
    readingTime: post.readingTime,
  };
};

// Get writer dashboard — overview of all their posts
const getWriterDashboard = async (authorId) => {
  const posts = await Post.findAll({
    where: { authorId },
    attributes: ['id', 'title', 'slug', 'status', 'views', 'likesCount', 'publishedAt'],
    order: [['views', 'DESC']],
  });

  const totalPosts = posts.length;
  const publishedPosts = posts.filter((p) => p.status === 'published').length;
  const draftPosts = posts.filter((p) => p.status === 'draft').length;
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
  const totalLikes = posts.reduce((sum, p) => sum + p.likesCount, 0);

  const totalComments = await Comment.count({
    include: [
      {
        model: Post,
        where: { authorId },
        attributes: [],
      },
    ],
  });

  // Views in last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentViews = await PostView.count({
    include: [
      {
        model: Post,
        where: { authorId },
        attributes: [],
      },
    ],
    where: {
      createdAt: { [Op.gt]: sevenDaysAgo },
    },
  });

  return {
    overview: {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      totalLikes,
      totalComments,
      recentViews,
    },
    topPosts: posts.slice(0, 5),
  };
};

// Get trending posts — most viewed in last 7 days
const getTrendingPosts = async () => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const trending = await PostView.findAll({
    where: { createdAt: { [Op.gt]: sevenDaysAgo } },
    attributes: ['postId', [fn('COUNT', col('PostView.id')), 'viewCount']],
    include: [
      {
        model: Post,
        where: { status: 'published' },
        attributes: ['id', 'title', 'slug', 'excerpt', 'coverImage', 'readingTime', 'likesCount'],
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'avatar'],
          },
        ],
      },
    ],
    group: [
      'PostView.postId',
      'Post.id',
      'Post->author.id',
    ],
    order: [[literal('"viewCount"'), 'DESC']],
    limit: 10,
    subQuery: false,
  });

  return trending.map((item) => ({
    ...item.Post.toJSON(),
    viewCount: parseInt(item.dataValues.viewCount),
  }));
};

// Get global platform stats — public
const getPlatformStats = async () => {
  const totalPosts = await Post.count({ where: { status: 'published' } });
  const totalUsers = await User.count();
  const totalViews = await PostView.count();
  const totalLikes = await Like.count();
  const totalComments = await Comment.count();

  return {
    totalPosts,
    totalUsers,
    totalViews,
    totalLikes,
    totalComments,
  };
};

module.exports = {
  trackView,
  updateEngagement,
  getPostStats,
  getWriterDashboard,
  getTrendingPosts,
  getPlatformStats,
};