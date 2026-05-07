const postService = require('./post.service');
const { ApiResponse, ApiError } = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const { validationResult } = require('express-validator');

const createPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, 'Validation failed', errors.array());
  }

  const post = await postService.createPost(req.body, req.user.id);
  res.status(201).json(
    new ApiResponse(201, 'Post created successfully', post)
  );
});

const getAllPosts = asyncHandler(async (req, res) => {
  const result = await postService.getAllPosts(req.query);
  res.json(new ApiResponse(200, 'Posts fetched successfully', result));
});

const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await postService.getPostBySlug(req.params.slug);
  res.json(new ApiResponse(200, 'Post fetched successfully', post));
});

const getMyPosts = asyncHandler(async (req, res) => {
  const result = await postService.getMyPosts(req.user.id, req.query);
  res.json(new ApiResponse(200, 'Your posts fetched successfully', result));
});

const updatePost = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, 'Validation failed', errors.array());
  }

  const post = await postService.updatePost(
    req.params.id,
    req.body,
    req.user.id
  );
  res.json(new ApiResponse(200, 'Post updated successfully', post));
});

const deletePost = asyncHandler(async (req, res) => {
  await postService.deletePost(req.params.id, req.user.id, req.user.role);
  res.json(new ApiResponse(200, 'Post deleted successfully'));
});

module.exports = {
  createPost,
  getAllPosts,
  getPostBySlug,
  getMyPosts,
  updatePost,
  deletePost,
};