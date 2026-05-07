const Comment = require('./comment.model');
const Post = require('../posts/post.model');
const User = require('../users/user.model');
const { ApiError } = require('../../utils/ApiResponse');
const { getPagination, getPaginationMeta } = require('../../utils/pagination');
const { createNotification } = require('../notifications/notification.service');

// Add a comment or reply to a post
const addComment = async ({ postId, content, parentId = null }, authorId) => {
  // Check post exists and is published
  const post = await Post.findOne({
    where: { id: postId, status: 'published' },
  });
  if (!post) throw new ApiError(404, 'Post not found');

  // If replying, check parent comment exists on same post
  if (parentId) {
    const parent = await Comment.findOne({
      where: { id: parentId, postId },
    });
    if (!parent) throw new ApiError(404, 'Parent comment not found');

    // Only allow one level of nesting — replies cannot be replied to
    if (parent.parentId !== null) {
      throw new ApiError(400, 'Cannot reply to a reply — only one level of nesting allowed');
    }
  }

  const comment = await Comment.create({
    content,
    postId,
    authorId,
    parentId,
  });

  // Return with author info
  const result = await Comment.findByPk(comment.id, {
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'avatar'],
      },
    ],
  });

  // Notify post author about new comment
  await createNotification({
    receiverId: post.authorId,
    senderId: authorId,
    type: parentId ? 'reply' : 'comment',
    message: parentId ? 'replied to a comment on your post' : 'commented on your post',
    link: `/posts/${post.slug}`,
    postId: post.id,
    commentId: comment.id,
  });

  return result;
};

// Get all top-level comments for a post with their replies
const getCommentsByPost = async (postId, query) => {
  const post = await Post.findOne({
    where: { id: postId, status: 'published' },
  });
  if (!post) throw new ApiError(404, 'Post not found');

  const { page, limit, offset } = getPagination(query);

  const { count, rows } = await Comment.findAndCountAll({
    where: {
      postId,
      parentId: null, // only top-level comments
    },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'avatar'],
      },
      {
        model: Comment,
        as: 'replies',
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'avatar'],
          },
        ],
        order: [['createdAt', 'ASC']],
      },
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return {
    comments: rows,
    meta: getPaginationMeta(count, page, limit),
  };
};

// Update a comment — only the author can edit
const updateComment = async (commentId, content, authorId) => {
  const comment = await Comment.findByPk(commentId);
  if (!comment) throw new ApiError(404, 'Comment not found');

  if (comment.authorId !== authorId) {
    throw new ApiError(403, 'You are not allowed to edit this comment');
  }

  await comment.update({ content, isEdited: true });
  return comment;
};

// Delete a comment — author or admin can delete
const deleteComment = async (commentId, authorId, userRole) => {
  const comment = await Comment.findByPk(commentId);
  if (!comment) throw new ApiError(404, 'Comment not found');

  if (userRole !== 'admin' && comment.authorId !== authorId) {
    throw new ApiError(403, 'You are not allowed to delete this comment');
  }

  // Deleting parent also deletes all replies (CASCADE)
  await comment.destroy();
};

module.exports = {
  addComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
};