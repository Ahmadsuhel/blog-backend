const router = require('express').Router();
const controller = require('./analytics.controller');
const { authenticate } = require('../../middlewares/authenticate');

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics and stats endpoints
 */

/**
 * @swagger
 * /analytics/track-view:
 *   post:
 *     summary: Track a post view
 *     tags: [Analytics]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [postId]
 *             properties:
 *               postId:
 *                 type: string
 *                 example: paste-post-uuid-here
 *     responses:
 *       200:
 *         description: View tracked
 */
router.post('/track-view', controller.trackView);

/**
 * @swagger
 * /analytics/engagement:
 *   post:
 *     summary: Update scroll depth and time spent on a post
 *     tags: [Analytics]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [postId]
 *             properties:
 *               postId:
 *                 type: string
 *                 example: paste-post-uuid-here
 *               scrollDepth:
 *                 type: integer
 *                 example: 75
 *               timeSpent:
 *                 type: integer
 *                 example: 120
 *     responses:
 *       200:
 *         description: Engagement updated
 */
router.post('/engagement', controller.updateEngagement);

/**
 * @swagger
 * /analytics/trending:
 *   get:
 *     summary: Get trending posts from last 7 days
 *     tags: [Analytics]
 *     security: []
 *     responses:
 *       200:
 *         description: Top 10 trending posts by views
 */
router.get('/trending', controller.getTrendingPosts);

/**
 * @swagger
 * /analytics/platform:
 *   get:
 *     summary: Get overall platform statistics
 *     tags: [Analytics]
 *     security: []
 *     responses:
 *       200:
 *         description: Total posts, users, views, likes, comments
 */
router.get('/platform', controller.getPlatformStats);

/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     summary: Get writer dashboard — your posts overview
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview stats and top 5 posts
 */
router.get('/dashboard', authenticate, controller.getWriterDashboard);

/**
 * @swagger
 * /analytics/post/{postId}:
 *   get:
 *     summary: Get detailed stats for one of your posts
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Views, likes, comments, scroll depth, completion rate
 *       403:
 *         description: Not your post
 */
router.get('/post/:postId', authenticate, controller.getPostStats);

module.exports = router;    