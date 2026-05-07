const analyticsService = require('./analytics.service');
const { ApiResponse, ApiError } = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const trackView = asyncHandler(async (req, res) => {
  const { postId } = req.body;
  if (!postId) throw new ApiError(400, 'postId is required');

  const result = await analyticsService.trackView({
    postId,
    userId: req.user?.id || null,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  res.json(new ApiResponse(200, 'View tracked', result));
});

const updateEngagement = asyncHandler(async (req, res) => {
  const { postId, scrollDepth, timeSpent } = req.body;
  if (!postId) throw new ApiError(400, 'postId is required');

  await analyticsService.updateEngagement({
    postId,
    userId: req.user?.id || null,
    scrollDepth: scrollDepth || 0,
    timeSpent: timeSpent || 0,
  });

  res.json(new ApiResponse(200, 'Engagement updated'));
});

const getPostStats = asyncHandler(async (req, res) => {
  const stats = await analyticsService.getPostStats(
    req.params.postId,
    req.user.id
  );
  res.json(new ApiResponse(200, 'Post stats fetched', stats));
});

const getWriterDashboard = asyncHandler(async (req, res) => {
  const dashboard = await analyticsService.getWriterDashboard(req.user.id);
  res.json(new ApiResponse(200, 'Dashboard fetched', dashboard));
});

const getTrendingPosts = asyncHandler(async (req, res) => {
  const trending = await analyticsService.getTrendingPosts();
  res.json(new ApiResponse(200, 'Trending posts fetched', trending));
});

const getPlatformStats = asyncHandler(async (req, res) => {
  const stats = await analyticsService.getPlatformStats();
  res.json(new ApiResponse(200, 'Platform stats fetched', stats));
});

module.exports = {
  trackView,
  updateEngagement,
  getPostStats,
  getWriterDashboard,
  getTrendingPosts,
  getPlatformStats,
};