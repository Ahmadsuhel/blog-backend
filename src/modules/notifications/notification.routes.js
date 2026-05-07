const router = require('express').Router();
const controller = require('./notification.controller');
const { authenticate } = require('../../middlewares/authenticate');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification endpoints
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all your notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
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
 *           example: 20
 *     responses:
 *       200:
 *         description: Your notifications with pagination
 */
router.get('/', authenticate, controller.getMyNotifications);

/**
 * @swagger
 * /notifications/unread-count:
 *   get:
 *     summary: Get unread notification count
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns unreadCount number
 */
router.get('/unread-count', authenticate, controller.getUnreadCount);

/**
 * @swagger
 * /notifications/mark-all-read:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.put('/mark-all-read', authenticate, controller.markAllAsRead);

/**
 * @swagger
 * /notifications/all:
 *   delete:
 *     summary: Delete all your notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications deleted
 */
router.delete('/all', authenticate, controller.deleteAllNotifications);

/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Mark a single notification as read
 *     tags: [Notifications]
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
 *         description: Notification marked as read
 *       403:
 *         description: Not your notification
 *       404:
 *         description: Notification not found
 */
router.put('/:id/read', authenticate, controller.markAsRead);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a single notification
 *     tags: [Notifications]
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
 *         description: Notification deleted
 *       403:
 *         description: Not your notification
 *       404:
 *         description: Notification not found
 */
router.delete('/:id', authenticate, controller.deleteNotification);

module.exports = router;