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

### 📧 Email System
- **SMTP Integration**: Brevo (SendinBlue) SMTP service
- **Automated Notifications**: Connection request notifications
- **HTML Templates**: Rich email templates with styling

### 🔄 Background Jobs
- **Inngest Integration**: Event-driven background job processing
- **Webhook Handling**: Clerk webhook processing for user sync
- **Automatic Sync**: Real-time user data synchronization

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Clerk
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
│   └── post.controller.js # Post management logic
├── middleware/
│   └── auth.js           # Authentication middleware
├── models/
│   ├── user.models.js    # User schema
│   ├── post.models.js    # Post schema
│   └── connection.models.js # Connection schema
├── routes/
│   ├── user.routes.js    # User API routes
│   └── post.routes.js    # Post API routes
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

## 📚 API Documentation

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

## 🔄 Background Jobs (Inngest)

### User Sync Functions
- **User Created**: Syncs new Clerk users to MongoDB
- **User Updated**: Updates user data when changed in Clerk
- **User Deleted**: Removes user data when deleted from Clerk

### Email Notification System
- **Connection Request**: Sends immediate notification email
- **24-hour Reminder**: Sends reminder if request still pending

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
- **Authentication**: Clerk JWT token verification
- **File Upload Security**: Multer file validation
- **CORS**: Cross-origin resource sharing enabled
- **Environment Variables**: Sensitive data protection

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
- **Image Optimization**: ImageKit automatic compression
- **Database Indexing**: MongoDB indexes on frequently queried fields
- **Populate Optimization**: Selective field population
- **CDN**: ImageKit global CDN for image delivery

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

---

**Built with ❤️ for modern social media experiences**
