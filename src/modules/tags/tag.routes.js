const router = require('express').Router();
const controller = require('./tag.controller');
const { authenticate } = require('../../middlewares/authenticate');
const { body } = require('express-validator');

const tagValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Tag name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Tag name must be 2-50 characters'),
];

const postTagValidator = [
  body('tags')
    .isArray({ min: 1, max: 5 })
    .withMessage('Tags must be an array of 1-5 items'),
  body('tags.*')
    .trim()
    .notEmpty().withMessage('Each tag must be a non-empty string'),
];

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Tag endpoints
 */

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Get all tags
 *     tags: [Tags]
 *     security: []
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
 *         description: List of all tags sorted by post count
 */
router.get('/', controller.getAllTags);

/**
 * @swagger
 * /tags/{slug}:
 *   get:
 *     summary: Get a tag and its published posts
 *     tags: [Tags]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: javascript
 *     responses:
 *       200:
 *         description: Tag with posts
 *       404:
 *         description: Tag not found
 */
router.get('/:slug', controller.getTagBySlug);

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Create a new tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: JavaScript
 *               description:
 *                 type: string
 *                 example: Posts about JavaScript
 *     responses:
 *       201:
 *         description: Tag created successfully
 *       409:
 *         description: Tag already exists
 */
router.post('/', authenticate, tagValidator, controller.createTag);

/**
 * @swagger
 * /tags/post/{postId}:
 *   post:
 *     summary: Add tags to a post (max 5)
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tags]
 *             properties:
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["JavaScript", "Node.js", "Express"]
 *     responses:
 *       200:
 *         description: Tags added to post
 *       403:
 *         description: Not allowed to tag this post
 *       404:
 *         description: Post not found
 */
router.post('/post/:postId', authenticate, postTagValidator, controller.addTagsToPost);

/**
 * @swagger
 * /tags/post/{postId}:
 *   delete:
 *     summary: Remove all tags from a post
 *     tags: [Tags]
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
 *         description: Tags removed from post
 *       404:
 *         description: Post not found
 */
router.delete('/post/:postId', authenticate, controller.removeTagsFromPost);

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     summary: Delete a tag
 *     tags: [Tags]
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
 *         description: Tag deleted successfully
 *       404:
 *         description: Tag not found
 */
router.delete('/:id', authenticate, controller.deleteTag);

module.exports = router;