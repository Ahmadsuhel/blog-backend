const likeService = require('./like.service');
const { ApiResponse } = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const likePost = asyncHandler(async (req, res) => {
  const result = await likeService.likePost(req.user.id, req.params.postId);
  res.json(new ApiResponse(200, 'Post liked successfully', result));
});

const unlikePost = asyncHandler(async (req, res) => {
  const result = await likeService.unlikePost(req.user.id, req.params.postId);
  res.json(new ApiResponse(200, 'Post unliked successfully', result));
});

const isLiked = asyncHandler(async (req, res) => {
  const result = await likeService.isLiked(req.user.id, req.params.postId);
  res.json(new ApiResponse(200, 'Like status fetched', result));
});

const getPostLikes = asyncHandler(async (req, res) => {
  const result = await likeService.getPostLikes(req.params.postId, req.query);
  res.json(new ApiResponse(200, 'Post likes fetched', result));
});

const bookmarkPost = asyncHandler(async (req, res) => {
  const result = await likeService.bookmarkPost(req.user.id, req.params.postId);
  res.json(new ApiResponse(200, result.message));
});

const removeBookmark = asyncHandler(async (req, res) => {
  const result = await likeService.removeBookmark(req.user.id, req.params.postId);
  res.json(new ApiResponse(200, result.message));
});

const getMyBookmarks = asyncHandler(async (req, res) => {
  const result = await likeService.getMyBookmarks(req.user.id, req.query);
  res.json(new ApiResponse(200, 'Bookmarks fetched successfully', result));
});

const isBookmarked = asyncHandler(async (req, res) => {
  const result = await likeService.isBookmarked(req.user.id, req.params.postId);
  res.json(new ApiResponse(200, 'Bookmark status fetched', result));
});

module.exports = {
  likePost,
  unlikePost,
  isLiked,
  getPostLikes,
  bookmarkPost,
  removeBookmark,
  getMyBookmarks,
  isBookmarked,
};