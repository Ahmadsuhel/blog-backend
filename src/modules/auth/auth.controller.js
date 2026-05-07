const authService = require('./auth.service');
const { ApiResponse, ApiError } = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const { validationResult } = require('express-validator');
const { authenticate } = require('../../middlewares/authenticate');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, 'Validation failed', errors.array());
  }
  const user = await authService.register(req.body);
  res.status(201).json(
    new ApiResponse(201, 'Registration successful', user.toSafeObject())
  );
});

const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, 'Validation failed', errors.array());
  }

  const meta = {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
  };

  const { user, tokens } = await authService.login(req.body, meta);

  // Store refresh token in httpOnly cookie
  res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);

  res.json(
    new ApiResponse(200, 'Login successful', {
      user: user.toSafeObject(),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken, // also in response for mobile/Swagger testing
    })
  );
});

const refreshToken = asyncHandler(async (req, res) => {
  // Accept from cookie OR request body
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) {
    throw new ApiError(401, 'Refresh token is required');
  }

  const { user, tokens } = await authService.refreshAccessToken(token);

  res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);

  res.json(
    new ApiResponse(200, 'Token refreshed successfully', {
      accessToken: tokens.accessToken,
      // refreshToken: tokens.refreshToken,
    })
  );
});

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (token) {
    await authService.logout(token);
  }
  res.clearCookie('refreshToken');
  res.json(new ApiResponse(200, 'Logged out successfully'));
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  res.json(new ApiResponse(200, 'User fetched successfully', user.toSafeObject()));
});

module.exports = { register, login, refreshToken, logout, getMe };