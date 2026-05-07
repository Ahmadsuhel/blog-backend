const mediaService = require('./media.service');
const User = require('../users/user.model');
const Post = require('../posts/post.model');
const { ApiResponse, ApiError } = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

// Upload post cover image
const uploadCoverImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Please select an image file to upload');

  const result = await mediaService.uploadCoverImage(req.file);
  res.json(new ApiResponse(200, 'Cover image uploaded successfully', result));
});

// Upload and save avatar — also updates user record
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Please select an image file to upload');

  const result = await mediaService.uploadAvatar(req.file);

  // Save avatar URL to user profile
  await User.update(
    { avatar: result.url },
    { where: { id: req.user.id } }
  );

  res.json(new ApiResponse(200, 'Avatar uploaded successfully', result));
});

// Upload image inside post content editor
const uploadContentImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Please select an image file to upload');

  const result = await mediaService.uploadContentImage(req.file);
  res.json(new ApiResponse(200, 'Content image uploaded successfully', result));
});

// Delete image
const deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) throw new ApiError(400, 'publicId is required');

  const result = await mediaService.deleteImage(publicId);
  res.json(new ApiResponse(200, result.message));
});

module.exports = {
  uploadCoverImage,
  uploadAvatar,
  uploadContentImage,
  deleteImage,
};