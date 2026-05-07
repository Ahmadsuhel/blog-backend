const router = require('express').Router();
const controller = require('./search.controller');

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Search endpoints
 */

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search posts by keyword, tag, or author
 *     tags: [Search]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: q
 *         description: Search keyword (searches title, content, excerpt)
 *         schema:
 *           type: string
 *           example: javascript
 *       - in: query
 *         name: tag
 *         description: Filter by tag slug
 *         schema:
 *           type: string
 *           example: node-js
 *       - in: query
 *         name: author
 *         description: Filter by author name
 *         schema:
 *           type: string
 *           example: John
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
 *         description: Search results with pagination
 *       400:
 *         description: No search parameters provided
 */
router.get('/', controller.searchPosts);

module.exports = router;