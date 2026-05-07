const router = require('express').Router();
const controller = require('./auth.controller');
const { registerValidator, loginValidator } = require('./auth.validators');
const { authenticate } = require('../../middlewares/authenticate');
const authService = require('./auth.service');
const { ApiResponse } = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Secret123
 *               role:
 *                 type: string
 *                 enum: [reader, writer]
 *                 example: writer
 *     responses:
 *       201:
 *         description: Registration successful
 *       409:
 *         description: Email already registered
 *       422:
 *         description: Validation failed
 */
router.post('/register', registerValidator, controller.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and get tokens
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Secret123
 *     responses:
 *       200:
 *         description: Login successful — returns accessToken and refreshToken
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', loginValidator, controller.login);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Get a new access token using refresh token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: your_refresh_token_here
 *     responses:
 *       200:
 *         description: New access token issued
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh-token', controller.refreshToken);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get currently logged in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Unauthorized — token missing or invalid
 */
router.get('/me', authenticate, controller.getMe);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout from current device
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', authenticate, controller.logout);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: Reset email sent if account exists
 */
router.post('/forgot-password', asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  res.json(new ApiResponse(200, 'If this email exists, a reset link has been sent'));
}));

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using token from email
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token:
 *                 type: string
 *                 example: paste_token_from_email_here
 *               newPassword:
 *                 type: string
 *                 example: NewSecret456
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Token invalid or expired
 */
router.post('/reset-password', asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.newPassword);
  res.json(new ApiResponse(200, 'Password reset successful — please login'));
}));
module.exports = router;