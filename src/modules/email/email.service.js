const nodemailer = require('nodemailer');
const {
  welcomeTemplate,
  passwordResetTemplate,
  passwordChangedTemplate,
  newCommentTemplate,
  weeklyDigestTemplate,
} = require('./email.templates');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Base send function
const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"Blog App" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Email failed to ${to}:`, error.message);
    // Don't throw — email failure should not crash the request
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  const { subject, html } = welcomeTemplate({ name: user.name });
  await sendEmail({ to: user.email, subject, html });
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${resetToken}`;
  const { subject, html } = passwordResetTemplate({
    name: user.name,
    resetUrl,
  });
  await sendEmail({ to: user.email, subject, html });
};

// Send password changed confirmation
const sendPasswordChangedEmail = async (user) => {
  const { subject, html } = passwordChangedTemplate({ name: user.name });
  await sendEmail({ to: user.email, subject, html });
};

// Send new comment notification
const sendNewCommentEmail = async ({ author, commenter, post }) => {
  const postUrl = `${process.env.CLIENT_URL}/posts/${post.slug}`;
  const { subject, html } = newCommentTemplate({
    authorName: author.name,
    commenterName: commenter.name,
    postTitle: post.title,
    postUrl,
  });
  await sendEmail({ to: author.email, subject, html });
};

// Send weekly digest
const sendWeeklyDigest = async (user, posts) => {
  const { subject, html } = weeklyDigestTemplate({
    name: user.name,
    posts,
  });
  await sendEmail({ to: user.email, subject, html });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendNewCommentEmail,
  sendWeeklyDigest,
};