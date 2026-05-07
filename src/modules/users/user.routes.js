const router = require('express').Router();
const controller = require('./user.controller');
const { authenticate } = require('../../middlewares/authenticate');
const { body } = require('express-validator');

const updateProfileValidator = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be 2-100 characters'),
    body('bio')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Bio must be under 500 characters'),
    body('avatar')
        .optional()
        .isURL()
        .withMessage('Avatar must be a valid URL'),
];

const changePasswordValidator = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters')
        .matches(/[A-Z]/)
        .withMessage('Must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Must contain at least one lowercase letter')
        .matches(/[0-9]/)
        .withMessage('Must contain at least one number'),
];

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile endpoints
 */

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update your own profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Updated
 *               bio:
 *                 type: string
 *                 example: I am a tech blogger
 *               avatar:
 *                 type: string
 *                 example: https://example.com/avatar.jpg
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', authenticate, updateProfileValidator, controller.updateProfile);

/**
 * @swagger
 * /users/change-password:
 *   put:
 *     summary: Change your password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: Secret123
 *               newPassword:
 *                 type: string
 *                 example: NewSecret456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Current password is incorrect
 */
router.put('/change-password', authenticate, changePasswordValidator, controller.changePassword);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get public profile of any user
 *     tags: [Users]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: paste-user-uuid-here
 *     responses:
 *       200:
 *         description: User profile with followers, following and post counts
 *       404:
 *         description: User not found
 */
router.get('/:id', controller.getUserProfile);

/**
 * @swagger
 * /users/{id}/posts:
 *   get:
 *     summary: Get published posts of a user
 *     tags: [Users]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *         description: User posts
 *       404:
 *         description: User not found
 */
router.get('/:id/posts', controller.getUserPosts);

/**
 * @swagger
 * /users/{id}/followers:
 *   get:
 *     summary: Get followers of a user
 *     tags: [Users]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *         description: List of followers
 *       404:
 *         description: User not found
 */
router.get('/:id/followers', controller.getFollowers);

/**
 * @swagger
 * /users/{id}/following:
 *   get:
 *     summary: Get users that this user follows
 *     tags: [Users]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *         description: List of following
 *       404:
 *         description: User not found
 */
router.get('/:id/following', controller.getFollowing);

/**
 * @swagger
 * /users/{id}/follow:
 *   post:
 *     summary: Follow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: paste-user-uuid-to-follow
 *     responses:
 *       200:
 *         description: User followed successfully
 *       400:
 *         description: Cannot follow yourself
 *       409:
 *         description: Already following
 */
router.post('/:id/follow', authenticate, controller.followUser);

/**
 * @swagger
 * /users/{id}/unfollow:
 *   post:
 *     summary: Unfollow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: paste-user-uuid-to-unfollow
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 *       404:
 *         description: You are not following this user
 */
router.post('/:id/unfollow', authenticate, controller.unfollowUser);

module.exports = router;