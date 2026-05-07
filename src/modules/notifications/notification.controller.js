const notificationService = require('./notification.service');
const { ApiResponse } = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const getMyNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getMyNotifications(
    req.user.id,
    req.query
  );
  res.json(new ApiResponse(200, 'Notifications fetched successfully', result));
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const result = await notificationService.getUnreadCount(req.user.id);
  res.json(new ApiResponse(200, 'Unread count fetched', result));
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(
    req.params.id,
    req.user.id
  );
  res.json(new ApiResponse(200, 'Notification marked as read', notification));
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user.id);
  res.json(new ApiResponse(200, result.message));
});

const deleteNotification = asyncHandler(async (req, res) => {
  await notificationService.deleteNotification(req.params.id, req.user.id);
  res.json(new ApiResponse(200, 'Notification deleted successfully'));
});

const deleteAllNotifications = asyncHandler(async (req, res) => {
  await notificationService.deleteAllNotifications(req.user.id);
  res.json(new ApiResponse(200, 'All notifications deleted'));
});

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
};