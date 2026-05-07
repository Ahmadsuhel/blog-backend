const router = require('express').Router();
const controller = require('./comment.controller');
const { authenticate } = require('../../middlewares/authenticate');
const { body } = require('express-validator');

const commentValidator = [
  body('content')
    .trim()
    .notEmpty().withMessage('Comment content is required')
    .isLength({ min: 1, max: 2000 }).withMessage('Comment must be 1-2000 characters'),
];

const addCommentValidator = [
  ...commentValidator,
  body('postId')
    .notEmpty().withMessage('Post ID is required')
    .isUUID().withMessage('Post ID must be a valid UUID'),
  body('parentId')
    .optional()
    .isUUID().withMessage('Parent ID must be a valid UUID'),
];

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment endpoints
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Add a comment or reply to a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [postId, content]
 *             properties:
 *               postId:
 *                 type: string
 *                 example: paste-post-uuid-here
 *               content:
 *                 type: string
 *                 example: Great post, really enjoyed reading this!
 *               parentId:
 *                 type: string
 *                 description: Pass parent comment ID to reply to a comment
 *                 example: null
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       404:
 *         description: Post not found
 *       422:
 *         description: Validation failed
 */
router.post('/', authenticate, addCommentValidator, controller.addComment);

/**
 * @swagger
 * /comments/post/{postId}:
 *   get:
 *     summary: Get all comments for a post with replies
 *     tags: [Comments]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           example: paste-post-uuid-here
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Comments with nested replies
 *       404:
 *         description: Post not found
 */
router.get('/post/:postId', controller.getCommentsByPost);

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Edit a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 example: Updated comment content here
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       403:
 *         description: Not allowed to edit this comment
 *       404:
 *         description: Comment not found
 */
router.put('/:id', authenticate, commentValidator, controller.updateComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: Not allowed to delete this comment
 *       404:
 *         description: Comment not found
 */
router.delete('/:id', authenticate, controller.deleteComment);

module.exports = router;