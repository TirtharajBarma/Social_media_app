# Social Media App - Backend API

A comprehensive social media platform backend built with Node.js, Express, MongoDB, and modern technologies including Clerk authentication, ImageKit for media processing, and Inngest for background jobs.

## 🚀 Features

### 👤 User Management
- **Authentication**: Clerk-based authentication with JWT tokens
- **Profile Management**: Update profile with bio, location, profile/cover images
- **User Discovery**: Search users by username, email, location, or name
- **Social Features**: Follow/unfollow users, connection requests

### 🔗 Connection System
- **Connection Requests**: Send/accept connection requests (LinkedIn-style)
- **Rate Limiting**: Maximum 20 connection requests per 24 hours
- **Email Notifications**: Automated email notifications for connection requests
- **Reminder System**: 24-hour reminder emails for pending requests

### 📱 Post Management
- **Create Posts**: Text, image, or text with image posts
- **Image Processing**: Automatic optimization and WebP conversion
- **Feed Generation**: Personalized feed based on connections and followings
- **Like System**: Like/unlike posts with real-time updates

### � Real-Time Messaging
- **Direct Messaging**: Send text and image messages between users
- **Server-Sent Events (SSE)**: Real-time message delivery without WebSocket overhead
- **Message Status**: Read receipts and seen indicators
- **Media Support**: Image messages with automatic optimization
- **Recent Messages**: Inbox functionality with conversation previews

### 📸 Stories System
- **Story Creation**: Text, image, and video stories with custom backgrounds
- **Auto-Delete**: Stories automatically expire after 24 hours
- **Story Feed**: View stories from connections and followers
- **View Tracking**: Track who viewed your stories
- **Background Jobs**: Automatic cleanup using Inngest

### 📧 Email & Notifications
- **SMTP Integration**: Brevo (SendinBlue) SMTP service
- **Connection Notifications**: Automated email notifications for connection requests
- **Unseen Messages Alert**: Daily email digest for unread messages
- **HTML Templates**: Rich email templates with styling

### 🔄 Background Jobs
- **Inngest Integration**: Event-driven background job processing
- **Webhook Handling**: Clerk webhook processing for user sync
- **Story Cleanup**: Automatic story deletion after 24 hours
- **Email Automation**: Scheduled notifications and reminders
- **Automatic Sync**: Real-time user data synchronization

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Clerk
- **Real-time Communication**: Server-Sent Events (SSE)
- **Image Processing**: ImageKit
- **File Upload**: Multer
- **Email Service**: Nodemailer + Brevo SMTP
- **Background Jobs**: Inngest
- **Deployment**: Vercel

## 📁 Project Structure

```
server/
├── config/
│   ├── db.js              # MongoDB connection
│   ├── imageKit.js        # ImageKit configuration
│   ├── multar.js          # Multer file upload setup
│   └── nodeMailer.js      # Email configuration
├── controllers/
│   ├── user.controller.js # User management logic
│   ├── post.controller.js # Post management logic
│   ├── message.controller.js # Real-time messaging logic
│   └── story.controller.js # Story management logic
├── middleware/
│   └── auth.js           # Authentication middleware
├── models/
│   ├── user.models.js    # User schema
│   ├── post.models.js    # Post schema
│   ├── connection.models.js # Connection schema
│   ├── messages.model.js # Message schema
│   └── story.models.js   # Story schema
├── routes/
│   ├── user.routes.js    # User API routes
│   ├── post.routes.js    # Post API routes
│   ├── message.route.js  # Messaging API routes
│   └── story.route.js    # Story API routes
├── inngest/
│   └── inngest.js        # Background job functions
├── server.js             # Main application entry
├── package.json          # Dependencies and scripts
├── vercel.json           # Vercel deployment config
└── .env                  # Environment variables
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB database
- Clerk account
- ImageKit account
- Brevo SMTP account

### 1. Clone the repository
```bash
git clone <repository-url>
cd social_media/server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the server directory:

```env
# Frontend URL
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNIN_KEY=your_inngest_signin_key

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key

# ImageKit
IMAGEKIT_PUBLIC_KEY=public_your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=private_your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint

# Email (Brevo SMTP)
SENDER_EMAIL=your_verified_sender@email.com
SMTP_USER=your_brevo_smtp_user
SMTP_PASS=your_brevo_smtp_password
```

### 4. Start the development server
```bash
npm run dev
```

The server will start on `http://localhost:4000`

## � Real-Time Architecture

### Server-Sent Events (SSE) Implementation
This application uses **Server-Sent Events** instead of WebSockets for real-time messaging, providing:

- **Lightweight Communication**: HTTP-based, no additional protocol overhead
- **Automatic Reconnection**: Browser handles reconnection automatically
- **Firewall Friendly**: Works through corporate proxies and firewalls
- **One-Way Optimal**: Perfect for message notifications (server → client)

### SSE Connection Flow
```javascript
// Client establishes SSE connection
GET /api/messages/:userId

// Server maintains connection pool
connections[userId] = responseObject;

// Real-time message delivery
connections[recipientId].write(`data: ${JSON.stringify(message)}\n\n`);
```

### Why SSE over Socket.io?
1. **Simpler Architecture**: No complex bidirectional protocol needed
2. **Better Performance**: Lower overhead for message notifications
3. **Native Browser Support**: No additional client libraries required
4. **HTTP/2 Compatible**: Works seamlessly with modern HTTP infrastructure

## �📚 API Documentation

### Authentication
All protected routes require a Bearer token in the Authorization header.

### User Routes (`/api/users`)

#### Get User Data
```http
GET /api/users/data
Authorization: Bearer <token>
```

#### Update User Profile
```http
POST /api/users/update
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "username": "string",
  "bio": "string", 
  "location": "string",
  "full_name": "string",
  "profile": "file",
  "cover": "file"
}
```

#### Discover Users
```http
POST /api/users/discover
Authorization: Bearer <token>
Content-Type: application/json

{
  "input": "search_query"
}
```

#### Follow User
```http
POST /api/users/follow
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "user_id_to_follow"
}
```

#### Unfollow User
```http
POST /api/users/unfollow
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "user_id_to_unfollow"
}
```

#### Send Connection Request
```http
POST /api/users/connect
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "user_id_to_connect"
}
```

#### Accept Connection Request
```http
POST /api/users/accept
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "requester_user_id"
}
```

#### Get User Connections
```http
GET /api/users/connections
Authorization: Bearer <token>
```

### Post Routes (`/api/post`)

#### Create Post
```http
POST /api/post/add
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "content": "string",
  "post_type": "text|image|text_with_image",
  "image": "file[]" (max 4 images)
}
```

#### Get Feed Posts
```http
GET /api/post/feed
Authorization: Bearer <token>
```

#### Like/Unlike Post
```http
POST /api/post/like
Authorization: Bearer <token>
Content-Type: application/json

{
  "postId": "post_id"
}
```

### Message Routes (`/api/messages`)

#### Establish SSE Connection (Real-time)
```http
GET /api/messages/:userId
```
*Note: This creates a Server-Sent Events connection for real-time message delivery*

#### Send Message
```http
POST /api/messages/send
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "to_user_id": "string",
  "text": "string",
  "image": "file" (optional)
}
```

#### Get Chat Messages
```http
POST /api/messages/get
Authorization: Bearer <token>
Content-Type: application/json

{
  "to_user_id": "user_id"
}
```

#### Get Recent Messages (Inbox)
```http
GET /api/messages/recent/:userId
Authorization: Bearer <token>
```

### Story Routes (`/api/stories`)

#### Create Story
```http
POST /api/stories/create
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "content": "string",
  "media_type": "text|image|video",
  "background_color": "string",
  "media": "file" (for image/video)
}
```

#### Get Stories Feed
```http
GET /api/stories/get
Authorization: Bearer <token>
```

## 🗄 Database Schemas

### User Schema
```javascript
{
  _id: String,                    // Clerk user ID
  full_name: String,
  username: String,
  email: String,
  bio: String,
  profile_picture: String,
  cover_photo: String,
  location: String,
  followers: [String],            // User IDs
  connection: [String],           // Connected user IDs
  following: [String],            // Following user IDs
  createdAt: Date,
  updatedAt: Date
}
```

### Post Schema
```javascript
{
  user: String,                   // User ID (ref: User)
  content: String,
  image_urls: [String],           // ImageKit URLs
  post_type: String,              // "text"|"image"|"text_with_image"
  likes_count: [String],          // Array of user IDs who liked
  createdAt: Date,
  updatedAt: Date
}
```

### Connection Schema
```javascript
{
  from_user_id: String,           // Requester user ID
  to_user_id: String,             // Recipient user ID
  status: String,                 // "pending"|"accepted"
  createdAt: Date,
  updatedAt: Date
}
```

### Message Schema
```javascript
{
  from_user_id: String,           // Sender user ID (ref: User)
  to_user_id: String,             // Recipient user ID (ref: User)
  text: String,                   // Message content
  message_type: String,           // "text"|"image"
  media_url: String,              // ImageKit URL for images
  seen: Boolean,                  // Read receipt (default: false)
  createdAt: Date,
  updatedAt: Date
}
```

### Story Schema
```javascript
{
  user: String,                   // Story owner user ID (ref: User)
  content: String,                // Text content
  media_url: [String],            // Media URLs from ImageKit
  media_type: String,             // "text"|"image"|"video"
  views_count: [String],          // Array of user IDs who viewed
  background_color: String,       // Background color for text stories
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 Background Jobs (Inngest)

### User Sync Functions
- **User Created**: Syncs new Clerk users to MongoDB
- **User Updated**: Updates user data when changed in Clerk
- **User Deleted**: Removes user data when deleted from Clerk

### Email Notification System
- **Connection Request**: Sends immediate notification email
- **24-hour Reminder**: Sends reminder if request still pending
- **Unseen Messages**: Daily email digest for unread messages (9 AM cron job)

### Story Management
- **Auto-Delete Stories**: Removes stories after exactly 24 hours
- **Scheduled Cleanup**: Background job triggered when story is created

### Real-Time Features
- **SSE Connection Management**: Handles user online/offline status
- **Message Broadcasting**: Delivers messages instantly to online users
- **Connection Pooling**: Maintains active SSE connections efficiently

## 🚀 Deployment

### Vercel Deployment
The project includes a `vercel.json` configuration for easy deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables Setup
1. Add all environment variables in Vercel dashboard
2. Configure Clerk webhook endpoint to your deployed URL
3. Update ImageKit CORS settings for your domain

## 🔒 Security Features

- **Rate Limiting**: Connection request limits (20/24hrs)
- **Authentication**: Clerk JWT token verification on all protected routes
- **File Upload Security**: Multer file validation and size limits
- **CORS**: Cross-origin resource sharing enabled for frontend
- **Environment Variables**: Sensitive data protection
- **SSE Security**: User-specific connections with automatic cleanup
- **Image Validation**: File type and size validation for uploads
- **SQL Injection Prevention**: Mongoose ODM provides built-in protection

## 🧪 Testing

### Using Postman/Thunder Client

1. **Authentication**: Include Clerk session token in headers
2. **File Uploads**: Use form-data for multipart requests
3. **JSON Requests**: Set Content-Type to application/json

### Example Request Headers
```
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
Content-Type: application/json
```

## 📝 Development Notes

### Code Architecture
- **MVC Pattern**: Models, Views (JSON responses), Controllers
- **Middleware**: Authentication, file upload processing
- **Error Handling**: Try-catch blocks with meaningful responses
- **Data Validation**: Mongoose schema validation

### Performance Optimizations
- **Image Optimization**: ImageKit automatic compression and WebP conversion
- **Database Indexing**: MongoDB indexes on frequently queried fields
- **Populate Optimization**: Selective field population for better query performance
- **CDN**: ImageKit global CDN for image delivery
- **SSE Efficiency**: Lightweight real-time communication without WebSocket overhead
- **Background Processing**: CPU-intensive tasks handled by Inngest
- **Connection Pooling**: MongoDB connection pooling for better performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check the documentation
- Review the error logs in console

## 🌟 Feature Summary

This social media backend provides a **complete Instagram/LinkedIn hybrid experience**:

### 📱 **Core Social Features**
- ✅ User profiles with image uploads
- ✅ Follow/unfollow relationships
- ✅ Professional connection requests
- ✅ Post creation with media support
- ✅ Real-time messaging system
- ✅ Story system with auto-expiry

### 🚀 **Advanced Functionality**
- ✅ Real-time notifications via SSE
- ✅ Background job processing
- ✅ Email notification system
- ✅ Image optimization and CDN
- ✅ Rate limiting and security
- ✅ Webhook integration with Clerk

### 🏗️ **Production-Ready Architecture**
- ✅ Scalable microservice design
- ✅ Event-driven background processing
- ✅ Optimized database queries
- ✅ Comprehensive error handling
- ✅ Security best practices
- ✅ Cloud deployment ready

---

**Built with ❤️ for modern social media experiences**
