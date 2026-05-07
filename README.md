# Blog Backend API 🚀

A full-featured REST API for a Medium-style tech blog platform built with Node.js, Express, and PostgreSQL.

## Live API Docs
> Run locally at `http://localhost:5000/api/docs`

## Tech Stack
 **Runtime**: Node.js + Express.js
 **Database**: PostgreSQL + Sequelize ORM
 **Auth**: JWT (Access + Refresh tokens) + Google OAuth 2.0
 **AI**: Google Gemini API (free)
 **Media**: Cloudinary CDN
 **Email**: Nodemailer + Gmail SMTP
 **Docs**: Swagger / OpenAPI 3.0

## Features
 JWT Authentication with refresh token rotation
 Google OAuth login
 Blog posts with draft/publish system
 Nested comments
 Tags & full-text search
 Like & bookmark posts
 Follow/unfollow authors
 In-app notifications
 AI writing assistant (improve, fix grammar, generate titles)
 Image upload via Cloudinary
 Email notifications & password reset
 Writer analytics dashboard
 Rate limiting & security headers

## Quick Start

```bash
git clone https://github.com/ahmadsuhel/blog-backend.git
cd blog-backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

## API Endpoints
| Module | Endpoints |
|--------|-----------|
| Auth | Register, Login, Google OAuth, Forgot/Reset Password |
| Posts | CRUD, Draft/Publish, Slug |
| Comments | Nested threads |
| Tags | Create, Attach to posts |
| Search | By keyword, tag, author |
| Likes | Like, Bookmark |
| Users | Profile, Follow/Unfollow |
| Notifications | In-app notifications |
| AI | Improve, Grammar fix, Summarize, Titles |
| Media | Avatar, Cover, Content images |
| Analytics | Views, Dashboard, Trending |
| Email | Welcome, Password reset, Weekly digest |

## Environment Variables
See `.env.example` for all required variables.

## Author
**Ahmad Suhel** — [GitHub](https://github.com/ahmadsuhel)