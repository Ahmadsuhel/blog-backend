const router = require('express').Router();
const controller = require('./post.controller');
const { createPostValidator, updatePostValidator } = require('./post.validators');
const { authenticate } = require('../../middlewares/authenticate');

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Blog post endpoints
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all published posts
 *     tags: [Posts]
 *     security: []
 *     parameters:
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
 *         description: List of published posts with pagination
 */
router.get('/', controller.getAllPosts);

/**
 * @swagger
 * /posts/my-posts:
 *   get:
 *     summary: Get all posts by logged in author (drafts + published)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published]
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
 *         description: Your posts
 *       401:
 *         description: Unauthorized
 */
router.get('/my-posts', authenticate, controller.getMyPosts);

/**
 * @swagger
 * /posts/{slug}:
 *   get:
 *     summary: Get a single post by slug
 *     tags: [Posts]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: my-first-post
 *     responses:
 *       200:
 *         description: Post data
 *       404:
 *         description: Post not found
 */
router.get('/:slug', controller.getPostBySlug);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 example: My First Blog Post
 *               content:
 *                 type: string
 *                 example: This is the full content of my blog post...
 *               excerpt:
 *                 type: string
 *                 example: A short summary of the post
 *               coverImage:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *                 example: draft
 *     responses:
 *       201:
 *         description: Post created successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation failed
 */
router.post('/', authenticate, createPostValidator, controller.createPost);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               coverImage:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       403:
 *         description: Not allowed to update this post
 *       404:
 *         description: Post not found
 */
router.put('/:id', authenticate, updatePostValidator, controller.updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
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
 *         description: Post deleted successfully
 *       403:
 *         description: Not allowed to delete this post
 *       404:
 *         description: Post not found
 */
router.delete('/:id', authenticate, controller.deletePost);

module.exports = router;