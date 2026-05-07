const crypto = require('crypto');
const { Op } = require('sequelize');
const User = require('../users/user.model');
const RefreshToken = require('../users/refreshToken.model');
const { ApiError } = require('../../utils/ApiResponse');
const { generateTokenPair, verifyRefreshToken } = require('../../utils/tokens');
const { sendWelcomeEmail, sendPasswordResetEmail, sendPasswordChangedEmail } = require('../email/email.service');

const register = async ({ name, email, password, role = 'reader' }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, 'Email is already registered');
  }

  const user = await User.create({ name, email, password, role });

  // Send welcome email — non blocking
  sendWelcomeEmail(user);

  return user;
};

const login = async ({ email, password }, { userAgent, ipAddress }) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !user.password) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const tokens = generateTokenPair(user);

  await RefreshToken.create({
    token: tokens.refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent,
    ipAddress,
  });

  return { user, tokens };
};

const refreshAccessToken = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);

  const stored = await RefreshToken.findOne({
    where: { token: refreshToken, isRevoked: false },
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw new ApiError(401, 'Refresh token is invalid or expired');
  }

  const user = await User.findByPk(decoded.id);
  if (!user || !user.isActive) {
    throw new ApiError(401, 'User not found');
  }

  stored.isRevoked = true;
  await stored.save();

  const tokens = generateTokenPair(user);

  await RefreshToken.create({
    token: tokens.refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { user, tokens };
};

const logout = async (refreshToken) => {
  await RefreshToken.update(
    { isRevoked: true },
    { where: { token: refreshToken } }
  );
};

const getMe = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const loginWithGoogle = async (user, { userAgent, ipAddress }) => {
  const tokens = generateTokenPair(user);

  await RefreshToken.create({
    token: tokens.refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent,
    ipAddress,
  });

  return { user, tokens };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });

  // Always return success even if email not found — security best practice
  if (!user) return;

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  await sendPasswordResetEmail(user, resetToken);
};

const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user) throw new ApiError(400, 'Reset token is invalid or has expired');

  user.password = newPassword;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();

  await sendPasswordChangedEmail(user);
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  getMe,
  loginWithGoogle,
  forgotPassword,
  resetPassword,
};