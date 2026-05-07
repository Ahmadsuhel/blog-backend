const welcomeTemplate = ({ name }) => ({
  subject: 'Welcome to Blog App!',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #4F46E5; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Welcome to Blog App</h1>
      </div>
      <div style="padding: 30px; background: #f9fafb;">
        <h2>Hi ${name}!</h2>
        <p>We are excited to have you on board. Your account has been created successfully.</p>
        <p>Here is what you can do on our platform:</p>
        <ul>
          <li>Write and publish blog posts</li>
          <li>Follow your favourite authors</li>
          <li>Like and bookmark posts</li>
          <li>Join the conversation in comments</li>
        </ul>
        <a href="${process.env.CLIENT_URL}" 
           style="background: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
          Start Reading
        </a>
      </div>
      <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
        <p>You received this email because you signed up at Blog App.</p>
      </div>
    </div>
  `,
});

const passwordResetTemplate = ({ name, resetUrl }) => ({
  subject: 'Reset Your Password',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #4F46E5; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Password Reset</h1>
      </div>
      <div style="padding: 30px; background: #f9fafb;">
        <h2>Hi ${name}!</h2>
        <p>You requested to reset your password. Click the button below to set a new password.</p>
        <p>This link expires in <strong>15 minutes</strong>.</p>
        <a href="${resetUrl}" 
           style="background: #DC2626; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
          Reset Password
        </a>
        <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
          If you did not request this, you can safely ignore this email.
          Your password will not change.
        </p>
      </div>
    </div>
  `,
});

const passwordChangedTemplate = ({ name }) => ({
  subject: 'Your Password Has Been Changed',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #059669; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Password Changed</h1>
      </div>
      <div style="padding: 30px; background: #f9fafb;">
        <h2>Hi ${name}!</h2>
        <p>Your password has been changed successfully.</p>
        <p>If you did not make this change, please contact support immediately.</p>
      </div>
    </div>
  `,
});

const newCommentTemplate = ({ authorName, commenterName, postTitle, postUrl }) => ({
  subject: `${commenterName} commented on your post`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #4F46E5; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">New Comment</h1>
      </div>
      <div style="padding: 30px; background: #f9fafb;">
        <h2>Hi ${authorName}!</h2>
        <p><strong>${commenterName}</strong> commented on your post <strong>"${postTitle}"</strong>.</p>
        <a href="${postUrl}" 
           style="background: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
          View Comment
        </a>
      </div>
    </div>
  `,
});

const weeklyDigestTemplate = ({ name, posts }) => ({
  subject: 'Your Weekly Blog Digest',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #4F46E5; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Weekly Digest</h1>
        <p style="color: #c7d2fe; margin: 5px 0 0;">Top posts this week</p>
      </div>
      <div style="padding: 30px; background: #f9fafb;">
        <h2>Hi ${name}!</h2>
        <p>Here are the top posts from this week you might have missed:</p>
        ${posts
          .map(
            (post) => `
          <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 16px; border: 1px solid #e5e7eb;">
            <h3 style="margin: 0 0 8px;">
              <a href="${process.env.CLIENT_URL}/posts/${post.slug}" 
                 style="color: #4F46E5; text-decoration: none;">
                ${post.title}
              </a>
            </h3>
            <p style="color: #6b7280; margin: 0 0 8px; font-size: 14px;">${post.excerpt || ''}</p>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              By ${post.author?.name || 'Unknown'} 
              · ${post.readingTime} min read 
              · ${post.views} views
            </p>
          </div>
        `
          )
          .join('')}
        <a href="${process.env.CLIENT_URL}" 
           style="background: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
          Read More Posts
        </a>
      </div>
      <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
        <p>You are receiving this because you are a member of Blog App.</p>
      </div>
    </div>
  `,
});

module.exports = {
  welcomeTemplate,
  passwordResetTemplate,
  passwordChangedTemplate,
  newCommentTemplate,
  weeklyDigestTemplate,
};