const router = require('express').Router();
const { ApiResponse } = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const { authenticate } = require('../../middlewares/authenticate');
const { sendWelcomeEmail, sendWeeklyDigest } = require('./email.service');
const Post = require('../posts/post.model');
const User = require('../users/user.model');

/**
 * @swagger
 * tags:
 *   name: Email
 *   description: Email endpoints
 */

/**
 * @swagger
 * /email/test-welcome:
 *   post:
 *     summary: Send yourself a test welcome email
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome email sent to your address
 */
router.post('/test-welcome', authenticate, asyncHandler(async (req, res) => {
  await sendWelcomeEmail(req.user);
  res.json(new ApiResponse(200, `Welcome email sent to ${req.user.email}`));
}));

/**
 * @swagger
 * /email/weekly-digest:
 *   post:
 *     summary: Send yourself the weekly digest email
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly digest sent to your address
 */
router.post('/weekly-digest', authenticate, asyncHandler(async (req, res) => {
  const posts = await Post.findAll({
    where: { status: 'published' },
    include: [{ model: User, as: 'author', attributes: ['name'] }],
    order: [['views', 'DESC']],
    limit: 5,
  });

  await sendWeeklyDigest(req.user, posts);
  res.json(new ApiResponse(200, `Weekly digest sent to ${req.user.email}`));
}));

module.exports = router;