const { verifyAccessToken } = require('../utils/tokens');
const { ApiError } = require('../utils/ApiResponse');
const User = require('../modules/users/user.model');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Access token missing');
  }

  const token = authHeader.split(' ')[1];

  const decoded = verifyAccessToken(token);

  const user = await User.findByPk(decoded.id);

  if (!user || !user.isActive) {
    throw new ApiError(401, 'User not found or account is inactive');
  }
  req.user = user;
  next();
});

module.exports = { authenticate };