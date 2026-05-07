const tagService = require('./tag.service');
const { ApiResponse, ApiError } = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const { validationResult } = require('express-validator');

const createTag = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, 'Validation failed', errors.array());
  }
  const tag = await tagService.createTag(req.body);
  res.status(201).json(new ApiResponse(201, 'Tag created successfully', tag));
});

const getAllTags = asyncHandler(async (req, res) => {
  const result = await tagService.getAllTags(req.query);
  res.json(new ApiResponse(200, 'Tags fetched successfully', result));
});

const getTagBySlug = asyncHandler(async (req, res) => {
  const result = await tagService.getTagBySlug(req.params.slug, req.query);
  res.json(new ApiResponse(200, 'Tag fetched successfully', result));
});

const addTagsToPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, 'Validation failed', errors.array());
  }
  const post = await tagService.addTagsToPost(
    req.params.postId,
    req.body.tags,
    req.user.id
  );
  res.json(new ApiResponse(200, 'Tags added to post successfully', post));
});

const removeTagsFromPost = asyncHandler(async (req, res) => {
  const result = await tagService.removeTagsFromPost(
    req.params.postId,
    req.user.id
  );
  res.json(new ApiResponse(200, result.message));
});

const deleteTag = asyncHandler(async (req, res) => {
  await tagService.deleteTag(req.params.id);
  res.json(new ApiResponse(200, 'Tag deleted successfully'));
});

module.exports = {
  createTag,
  getAllTags,
  getTagBySlug,
  addTagsToPost,
  removeTagsFromPost,
  deleteTag,
};