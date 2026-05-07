const commentService = require('./comment.service');
const { ApiResponse, ApiError } = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const { validationResult } = require('express-validator');
const { body } = require('express-validator');

const addComment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, 'Validation failed', errors.array());
  }

  const comment = await commentService.addComment(req.body, req.user.id);
  res.status(201).json(
    new ApiResponse(201, 'Comment added successfully', comment)
  );
});

const getCommentsByPost = asyncHandler(async (req, res) => {
  const result = await commentService.getCommentsByPost(
    req.params.postId,
    req.query
  );
  res.json(new ApiResponse(200, 'Comments fetched successfully', result));
});

const updateComment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, 'Validation failed', errors.array());
  }

  const comment = await commentService.updateComment(
    req.params.id,
    req.body.content,
    req.user.id
  );
  res.json(new ApiResponse(200, 'Comment updated successfully', comment));
});

const deleteComment = asyncHandler(async (req, res) => {
  await commentService.deleteComment(
    req.params.id,
    req.user.id,
    req.user.role
  );
  res.json(new ApiResponse(200, 'Comment deleted successfully'));
});

module.exports = {
  addComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
};