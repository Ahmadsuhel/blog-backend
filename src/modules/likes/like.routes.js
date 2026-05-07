const router = require('express').Router();
const controller = require('./like.controller');
const { authenticate } = require('../../middlewares/authenticate');

/**
 * @swagger
 * tags:
 *   name: Likes & Bookmarks
 *   description: Like and bookmark endpoints
 */

/**
 * @swagger
 * /likes/{postId}/like:
 *   post:
 *     summary: Like a post
 *     tags: [Likes & Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           example: paste-post-uuid-here
 *     responses:
 *       200:
 *         description: Post liked — returns updated likesCount
 *       409:
 *         description: Already liked
 *       404:
 *         description: Post not found
 */
router.post('/:postId/like', authenticate, controller.likePost);

/**
 * @swagger
 * /likes/{postId}/unlike:
 *   post:
 *     summary: Unlike a post
 *     tags: [Likes & Bookmarks]
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
 *         description: Post unliked — returns updated likesCount
 *       404:
 *         description: You have not liked this post
 */
router.post('/:postId/unlike', authenticate, controller.unlikePost);

/**
 * @swagger
 * /likes/{postId}/is-liked:
 *   get:
 *     summary: Check if you liked a post
 *     tags: [Likes & Bookmarks]
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
 *         description: Returns isLiked boolean
 */
router.get('/:postId/is-liked', authenticate, controller.isLiked);

/**
 * @swagger
 * /likes/{postId}/users:
 *   get:
 *     summary: Get all users who liked a post
 *     tags: [Likes & Bookmarks]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of users who liked this post
 */
router.get('/:postId/users', controller.getPostLikes);

/**
 * @swagger
 * /likes/{postId}/bookmark:
 *   post:
 *     summary: Bookmark a post
 *     tags: [Likes & Bookmarks]
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
 *         description: Post bookmarked successfully
 *       409:
 *         description: Already bookmarked
 */
router.post('/:postId/bookmark', authenticate, controller.bookmarkPost);

/**
 * @swagger
 * /likes/{postId}/bookmark:
 *   delete:
 *     summary: Remove bookmark from a post
 *     tags: [Likes & Bookmarks]
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
 *         description: Bookmark removed successfully
 *       404:
 *         description: Bookmark not found
 */
router.delete('/:postId/bookmark', authenticate, controller.removeBookmark);

/**
 * @swagger
 * /likes/bookmarks/me:
 *   get:
 *     summary: Get all your bookmarked posts
 *     tags: [Likes & Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Your bookmarked posts
 */
router.get('/bookmarks/me', authenticate, controller.getMyBookmarks);

/**
 * @swagger
 * /likes/{postId}/is-bookmarked:
 *   get:
 *     summary: Check if you bookmarked a post
 *     tags: [Likes & Bookmarks]
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
 *         description: Returns isBookmarked boolean
 */
router.get('/:postId/is-bookmarked', authenticate, controller.isBookmarked);

module.exports = router;