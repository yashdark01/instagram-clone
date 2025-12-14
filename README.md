# Instagram Clone - Full Stack Application

A modern, full-featured Instagram clone built with cutting-edge technologies, demonstrating industry best practices in full-stack web development. This project features a RESTful API backend and a responsive React frontend with real-time interactions.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This Instagram clone is a complete social media application that allows users to:
- Create accounts and authenticate securely
- Follow/unfollow other users
- Create posts with images and captions
- Like and comment on posts
- View personalized feeds
- Search for users
- Manage their profiles

The application is built with a focus on:
- **Scalability**: Modular architecture that can scale horizontally
- **Security**: Industry-standard authentication and authorization
- **Performance**: Optimized queries and efficient state management
- **User Experience**: Modern, responsive UI with smooth interactions
- **Code Quality**: TypeScript, proper error handling, and clean code practices

## ✨ Features

### Backend Features

- ✅ **User Authentication**
  - Secure signup with email/username validation
  - Login with email or username support
  - JWT-based authentication with httpOnly cookies
  - Password hashing using bcrypt (10 salt rounds)
  - Session management

- ✅ **User Management**
  - User profiles with bio and profile pictures
  - Follow/unfollow system
  - Follower and following lists
  - User search functionality
  - User suggestions

- ✅ **Post Management**
  - Create posts with base64 image encoding
  - Image upload support (up to 30MB)
  - Caption support
  - Delete posts (owner only)
  - Post pagination

- ✅ **Social Interactions**
  - Like/unlike posts
  - Comment on posts
  - Delete comments (owner or post owner)
  - Real-time like and comment counts

- ✅ **Feed System**
  - Personalized feed based on followed users
  - Shows all posts if user doesn't follow anyone
  - Infinite scroll pagination
  - Post enrichment with likes and comments

- ✅ **Security & Validation**
  - Input validation using Zod
  - MongoDB injection protection
  - CORS configuration
  - Error handling middleware
  - Request size limits

### Frontend Features

- ✅ **Modern UI/UX**
  - Instagram-inspired design
  - Responsive layout (mobile-first approach)
  - Tailwind CSS styling
  - shadcn/ui component library
  - Lucide React icons

- ✅ **State Management**
  - Redux Toolkit for centralized state
  - Optimistic UI updates
  - Caching for posts and users
  - Efficient data fetching

- ✅ **User Interface**
  - Login and signup pages
  - Home feed with infinite scroll
  - Create post page with image upload
  - User profile pages
  - Post detail pages
  - Search modal

- ✅ **Responsive Design**
  - Mobile-optimized bottom navigation
  - Desktop sidebar navigation
  - Adaptive layouts for all screen sizes
  - Touch-friendly interactions

- ✅ **Image Handling**
  - Base64 image encoding/decoding
  - Image preview
  - Drag and drop upload
  - Image validation

## 🛠 Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express** | ^4.18.2 | Web framework |
| **TypeScript** | ^5.3.3 | Type safety |
| **MongoDB** | Latest | Database |
| **Mongoose** | ^8.0.3 | ODM |
| **JWT** | ^9.0.2 | Authentication |
| **bcrypt** | ^5.1.1 | Password hashing |
| **Zod** | ^3.22.4 | Validation |
| **cookie-parser** | ^1.4.6 | Cookie handling |
| **CORS** | ^2.8.5 | Cross-origin requests |
| **tsx** | ^4.7.0 | TypeScript execution |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | ^14.0.4 | React framework |
| **React** | ^18.2.0 | UI library |
| **TypeScript** | 5.9.3 | Type safety |
| **Tailwind CSS** | ^3.4.1 | Styling |
| **Redux Toolkit** | ^2.11.1 | State management |
| **Axios** | ^1.6.2 | HTTP client |
| **shadcn/ui** | Latest | UI components |
| **Lucide React** | ^0.303.0 | Icons |
| **date-fns** | ^2.30.0 | Date formatting |

## 🏗 Architecture

### Backend Architecture

```
┌─────────────────────────────────────────┐
│           Client (Browser)              │
└──────────────┬──────────────────────────┘
               │ HTTP/HTTPS
               │
┌──────────────▼──────────────────────────┐
│         Express Server                  │
│  ┌──────────────────────────────────┐  │
│  │   Middleware Layer               │  │
│  │   - CORS                         │  │
│  │   - Cookie Parser                │  │
│  │   - Body Parser (30MB limit)     │  │
│  │   - Error Handler                │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│  ┌──────────────▼───────────────────┐  │
│  │   Route Layer                    │  │
│  │   - /api/auth                    │  │
│  │   - /api/users                   │  │
│  │   - /api/posts                   │  │
│  │   - /api/feed                    │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│  ┌──────────────▼───────────────────┐  │
│  │   Controller Layer               │  │
│  │   - Business Logic               │  │
│  │   - Data Transformation          │  │
│  │   - Response Formatting          │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│  ┌──────────────▼───────────────────┐  │
│  │   Model Layer (Mongoose)         │  │
│  │   - User                         │  │
│  │   - Post                         │  │
│  │   - Like                         │  │
│  │   - Comment                      │  │
│  │   - Follow                       │  │
│  └──────────────┬───────────────────┘  │
└─────────────────┼──────────────────────┘
                  │
         ┌────────▼────────┐
         │    MongoDB      │
         └─────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│         Next.js App Router               │
│  ┌──────────────────────────────────┐  │
│  │   Pages Layer                    │  │
│  │   - (auth)/login                 │  │
│  │   - (auth)/signup                │  │
│  │   - (protected)/home             │  │
│  │   - (protected)/create-post      │  │
│  │   - (protected)/profile/[userId] │  │
│  │   - (protected)/post/[postId]    │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│  ┌──────────────▼───────────────────┐  │
│  │   Components Layer               │  │
│  │   - Layout Components            │  │
│  │   - UI Components                │  │
│  │   - Feature Components           │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│  ┌──────────────▼───────────────────┐  │
│  │   Redux Store                    │  │
│  │   - authSlice                    │  │
│  │   - postsSlice                   │  │
│  │   - usersSlice                   │  │
│  │   - uiSlice                      │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│  ┌──────────────▼───────────────────┐  │
│  │   API Layer (Axios)              │  │
│  │   - authAPI                      │  │
│  │   - userAPI                      │  │
│  │   - postAPI                      │  │
│  │   - feedAPI                      │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) or **yarn** - Comes with Node.js
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
- **Git** - [Download](https://git-scm.com/)

### Optional but Recommended

- **Postman** or **Insomnia** - For API testing
- **VS Code** - Recommended IDE with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd instagram-colne
```

### Step 2: Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

Or create a `.env` file manually with the following content:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/instagram-clone

# For MongoDB Atlas (replace with your connection string):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/instagram-clone?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

**Important Security Notes:**
- Generate a strong JWT_SECRET (minimum 32 characters)
- Never commit `.env` files to version control
- Use different secrets for development and production

### Step 3: Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env.local
```

Or create a `.env.local` file manually:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

**Note:** The `NEXT_PUBLIC_` prefix is required for Next.js to expose the variable to the browser.

### Step 4: Database Setup

#### Option A: Local MongoDB

1. Install MongoDB locally following the [official guide](https://docs.mongodb.com/manual/installation/)
2. Start MongoDB service:
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`
   - **Windows**: Start MongoDB from Services
3. Verify MongoDB is running:
   ```bash
   mongosh
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string and update `MONGODB_URI` in `.env`

## ⚙️ Configuration

### Backend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port number | No | `5001` |
| `NODE_ENV` | Environment mode (`development`/`production`) | No | `development` |
| `MONGODB_URI` | MongoDB connection string | **Yes** | - |
| `JWT_SECRET` | Secret key for JWT tokens | **Yes** | - |
| `JWT_EXPIRES_IN` | JWT token expiration time | No | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | **Yes** | `http://localhost:3000` |

### Frontend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | **Yes** | `http://localhost:5001` |

## 🏃 Running the Project

### Development Mode

#### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5001`

You should see:
```
Server is running on port 5001
MongoDB connected successfully
```

#### Terminal 2: Start Frontend Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Mode

#### Build Backend

```bash
cd backend
npm run build
npm start
```

#### Build Frontend

```bash
cd frontend
npm run build
npm start
```

## 📚 API Documentation

### Base URL

```
http://localhost:5001/api
```

### Authentication

All protected routes require authentication via JWT token stored in httpOnly cookies.

#### Signup

```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe"
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",  // or username
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "bio": "User bio",
    "profilePicture": ""
  }
}
```

#### Get Current User

```http
GET /api/auth/me
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "bio": "User bio",
    "profilePicture": ""
  }
}
```

#### Logout

```http
POST /api/auth/logout
```

### Users

#### Get User Profile

```http
GET /api/users/:userId
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "fullName": "John Doe",
    "bio": "User bio",
    "profilePicture": "",
    "followersCount": 10,
    "followingCount": 5,
    "isFollowing": false,
    "isOwnProfile": false
  }
}
```

#### Get User Posts

```http
GET /api/users/:userId/posts?page=1&limit=10
```

#### Follow User

```http
POST /api/users/:userId/follow
```

#### Unfollow User

```http
DELETE /api/users/:userId/follow
```

#### Get Followers

```http
GET /api/users/:userId/followers
```

#### Get Following

```http
GET /api/users/:userId/following
```

#### Search Users

```http
GET /api/users/search?q=john
```

### Posts

#### Create Post

```http
POST /api/posts
Content-Type: application/json

{
  "imageUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "caption": "My first post!"
}
```

#### Get Post

```http
GET /api/posts/:postId
```

#### Delete Post

```http
DELETE /api/posts/:postId
```

#### Like Post

```http
POST /api/posts/:postId/like
```

#### Unlike Post

```http
DELETE /api/posts/:postId/like
```

#### Get Post Likes

```http
GET /api/posts/:postId/likes
```

#### Add Comment

```http
POST /api/posts/:postId/comments
Content-Type: application/json

{
  "text": "Great post!"
}
```

#### Get Post Comments

```http
GET /api/posts/:postId/comments?page=1&limit=50
```

#### Delete Comment

```http
DELETE /api/posts/:postId/comments/:commentId
```

### Feed

#### Get Feed

```http
GET /api/feed?page=1&limit=10
```

**Response:**
```json
{
  "posts": [
    {
      "_id": "post_id",
      "userId": {
        "id": "user_id",
        "username": "johndoe",
        "fullName": "John Doe",
        "profilePicture": ""
      },
      "imageUrl": "data:image/jpeg;base64,...",
      "caption": "Post caption",
      "likesCount": 10,
      "isLiked": false,
      "comments": [...],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPosts": 50,
    "totalPages": 5
  }
}
```

## 📁 Project Structure

```
instagram-colne/
├── backend/                          # Backend API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # MongoDB connection
│   │   ├── controllers/             # Business logic
│   │   │   ├── authController.ts    # Authentication logic
│   │   │   ├── userController.ts    # User operations
│   │   │   ├── postController.ts    # Post operations
│   │   │   └── feedController.ts    # Feed generation
│   │   ├── middleware/
│   │   │   ├── auth.ts              # JWT authentication
│   │   │   └── errorHandler.ts      # Error handling
│   │   ├── models/                  # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── Post.ts
│   │   │   ├── Like.ts
│   │   │   ├── Comment.ts
│   │   │   └── Follow.ts
│   │   ├── routes/                  # API routes
│   │   │   ├── auth.ts
│   │   │   ├── users.ts
│   │   │   ├── posts.ts
│   │   │   └── feed.ts
│   │   ├── utils/
│   │   │   ├── jwt.ts               # JWT utilities
│   │   │   └── validation.ts        # Zod schemas
│   │   └── server.ts                # Express server
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                         # Environment variables
│
├── frontend/                         # Frontend application
│   ├── src/
│   │   ├── app/                     # Next.js app router
│   │   │   ├── (auth)/             # Auth routes group
│   │   │   │   ├── login/
│   │   │   │   └── signup/
│   │   │   ├── (protected)/        # Protected routes
│   │   │   │   ├── home/
│   │   │   │   ├── create-post/
│   │   │   │   ├── profile/[userId]/
│   │   │   │   └── post/[postId]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── providers.tsx        # Redux provider
│   │   ├── components/              # React components
│   │   │   ├── layout/             # Layout components
│   │   │   │   ├── TopNavbar.tsx
│   │   │   │   ├── BottomNavbar.tsx
│   │   │   │   ├── LeftSidebar.tsx
│   │   │   │   └── RightSidebar.tsx
│   │   │   ├── post/               # Post components
│   │   │   │   ├── PostHeader.tsx
│   │   │   │   └── PostActions.tsx
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── image-upload.tsx
│   │   │   │   └── ...
│   │   │   ├── PostCard.tsx
│   │   │   ├── CommentSection.tsx
│   │   │   ├── FollowButton.tsx
│   │   │   └── SearchModal.tsx
│   │   ├── lib/                     # Utilities
│   │   │   ├── api.ts              # Axios client
│   │   │   ├── imageUtils.ts       # Image utilities
│   │   │   └── utils.ts            # General utilities
│   │   ├── store/                   # Redux store
│   │   │   ├── index.ts            # Store configuration
│   │   │   ├── hooks.ts            # Typed hooks
│   │   │   ├── slices/             # Redux slices
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── postsSlice.ts
│   │   │   │   ├── usersSlice.ts
│   │   │   │   └── uiSlice.ts
│   │   │   ├── thunks/             # Async actions
│   │   │   │   ├── authThunks.ts
│   │   │   │   ├── postThunks.ts
│   │   │   │   └── userThunks.ts
│   │   │   └── selectors/          # Redux selectors
│   │   │       ├── authSelectors.ts
│   │   │       ├── postSelectors.ts
│   │   │       ├── userSelectors.ts
│   │   │       └── uiSelectors.ts
│   │   └── types/                   # TypeScript types
│   │       └── index.ts
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── .env.local                   # Environment variables
│
├── postman/                          # API testing
│   └── Instagram_Clone_API.postman_collection.json
│
└── README.md                         # This file
```

## 💻 Development

### Backend Development

```bash
cd backend

# Development mode with hot reload
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

### Frontend Development

```bash
cd frontend

# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for Next.js
- **Prettier**: Recommended for code formatting
- **Naming Conventions**:
  - Components: PascalCase (e.g., `PostCard.tsx`)
  - Utilities: camelCase (e.g., `imageUtils.ts`)
  - Constants: UPPER_SNAKE_CASE

## 🧪 Testing

### API Testing with Postman

1. Import the Postman collection:
   - File: `postman/Instagram_Clone_API.postman_collection.json`
   - The collection includes all API endpoints

2. Set environment variables:
   - `base_url`: `http://localhost:5001`

3. Testing workflow:
   ```
   1. Signup → Creates new user
   2. Login → Gets authentication cookie
   3. Get Current User → Verify authentication
   4. Create Post → Upload image and caption
   5. Get Feed → View posts
   6. Like/Unlike Post → Test interactions
   7. Add Comment → Test commenting
   8. Follow/Unfollow → Test social features
   ```

### Manual Testing Checklist

- [ ] User can sign up with valid credentials
- [ ] User can login with email or username
- [ ] Protected routes require authentication
- [ ] User can create posts with images
- [ ] User can like/unlike posts
- [ ] User can comment on posts
- [ ] User can follow/unfollow other users
- [ ] Feed shows posts from followed users
- [ ] Search functionality works correctly
- [ ] Profile page displays user information
- [ ] Mobile responsive design works

## 🚢 Deployment

### Backend Deployment

1. **Environment Variables**: Set all required environment variables
2. **Build**: `npm run build`
3. **Start**: `npm start`
4. **Process Manager**: Use PM2 or similar:
   ```bash
   pm2 start dist/server.js --name instagram-api
   ```

### Frontend Deployment

1. **Environment Variables**: Set `NEXT_PUBLIC_API_URL`
2. **Build**: `npm run build`
3. **Start**: `npm start`

### Recommended Platforms

- **Backend**: 
  - Heroku
  - Railway
  - Render
  - AWS EC2
  - DigitalOcean

- **Frontend**:
  - Vercel (recommended for Next.js)
  - Netlify
  - AWS Amplify

- **Database**:
  - MongoDB Atlas (recommended)
  - AWS DocumentDB
  - Self-hosted MongoDB

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Configure CORS for production domain
- [ ] Set up MongoDB connection with proper credentials
- [ ] Enable HTTPS
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure rate limiting
- [ ] Set up logging
- [ ] Enable database backups
- [ ] Configure CDN for static assets

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

## 📝 License

This project is for educational purposes. Feel free to use it as a learning resource or starting point for your own projects.

## 👤 Author

Created as a full-stack project demonstrating modern web development practices.

## 🙏 Acknowledgments

- Instagram for design inspiration
- Next.js team for the amazing framework
- shadcn for the beautiful UI components
- All open-source contributors

---

**Happy Coding! 🚀**
