const Notification = require('./notification.model');
const User = require('../users/user.model');
const { ApiError } = require('../../utils/ApiResponse');
const { getPagination, getPaginationMeta } = require('../../utils/pagination');

// Create a notification — called internally by other services
const createNotification = async ({
  receiverId,
  senderId,
  type,
  message,
  link = null,
  postId = null,
  commentId = null,
}) => {
  // Don't notify yourself
  if (receiverId === senderId) return null;

  const notification = await Notification.create({
    receiverId,
    senderId,
    type,
    message,
    link,
    postId,
    commentId,
  });

  return notification;
};

// Get all notifications for logged in user
const getMyNotifications = async (userId, query) => {
  const { page, limit, offset } = getPagination(query);

  const { count, rows } = await Notification.findAndCountAll({
    where: { receiverId: userId },
    include: [
      {
        model: User,
        as: 'sender',
        attributes: ['id', 'name', 'avatar'],
      },
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return {
    notifications: rows,
    meta: getPaginationMeta(count, page, limit),
  };
};

// Get unread notification count
const getUnreadCount = async (userId) => {
  const count = await Notification.count({
    where: { receiverId: userId, isRead: false },
  });
  return { unreadCount: count };
};

// Mark a single notification as read
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findByPk(notificationId);
  if (!notification) throw new ApiError(404, 'Notification not found');

  if (notification.receiverId !== userId) {
    throw new ApiError(403, 'Not your notification');
  }

  await notification.update({ isRead: true });
  return notification;
};

// Mark all notifications as read
const markAllAsRead = async (userId) => {
  await Notification.update(
    { isRead: true },
    { where: { receiverId: userId, isRead: false } }
  );
  return { message: 'All notifications marked as read' };
};

// Delete a single notification
const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findByPk(notificationId);
  if (!notification) throw new ApiError(404, 'Notification not found');

  if (notification.receiverId !== userId) {
    throw new ApiError(403, 'Not your notification');
  }

  await notification.destroy();
};

// Delete all notifications of logged in user
const deleteAllNotifications = async (userId) => {
  await Notification.destroy({ where: { receiverId: userId } });
};

module.exports = {
  createNotification,
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
};