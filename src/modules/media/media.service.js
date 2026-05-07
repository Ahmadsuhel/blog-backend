const cloudinary = require('../../config/cloudinary');
const { ApiError } = require('../../utils/ApiResponse');

// Upload buffer to Cloudinary
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(new ApiError(500, `Cloudinary upload failed: ${error.message}`));
      else resolve(result);
    });
    stream.end(buffer);
  });
};

// Upload post cover image
const uploadCoverImage = async (file) => {
  if (!file) throw new ApiError(400, 'No file provided');

  const result = await uploadToCloudinary(file.buffer, {
    folder: 'blog/covers',
    transformation: [
      { width: 1200, height: 630, crop: 'fill', gravity: 'auto' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    size: result.bytes,
  };
};

// Upload user avatar
const uploadAvatar = async (file) => {
  if (!file) throw new ApiError(400, 'No file provided');

  const result = await uploadToCloudinary(file.buffer, {
    folder: 'blog/avatars',
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
};

// Upload image inside post content
const uploadContentImage = async (file) => {
  if (!file) throw new ApiError(400, 'No file provided');

  const result = await uploadToCloudinary(file.buffer, {
    folder: 'blog/content',
    transformation: [
      { width: 800, crop: 'limit' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    size: result.bytes,
  };
};

// Delete image from Cloudinary by publicId
const deleteImage = async (publicId) => {
  if (!publicId) throw new ApiError(400, 'publicId is required');

  const result = await cloudinary.uploader.destroy(publicId);

  if (result.result !== 'ok') {
    throw new ApiError(400, 'Failed to delete image or image not found');
  }

  return { message: 'Image deleted successfully' };
};

module.exports = {
  uploadCoverImage,
  uploadAvatar,
  uploadContentImage,
  deleteImage,
};