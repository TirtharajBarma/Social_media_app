# 🌟 Chattrix - Social Media Client

A modern, responsive social media application built with React, featuring real-time messaging, stories, posts, and connections management.

## 🚀 Features

### 🔐 Authentication & User Management
- **Clerk Authentication**: Secure user authentication and session management
- **User Profiles**: Complete profile management with cover photos, bio, and verification badges
- **Profile Editing**: Real-time profile updates with image uploads

### 📱 Core Social Features
- **News Feed**: Real-time feed with posts from connections
- **Stories**: Create and view stories with text, images, and videos
  - Text stories with customizable background colors
  - Image and video stories with auto-expiry
  - Story viewer with progress indicators
- **Posts**: Create rich posts with text, images, and hashtag support
  - Multiple image uploads
  - Hashtag highlighting and linking
  - Like/unlike functionality
  - Real-time engagement metrics

### 💬 Messaging System
- **Real-time Chat**: Direct messaging between users
- **Message Types**: Text and media message support
- **Recent Messages**: Quick access to recent conversations
- **Message Status**: Read/unread indicators

### 🤝 Social Connections
- **Connections Management**: Follow/unfollow users
- **Discover People**: Find and connect with new users
- **Connection Status**: Track followers, following, and pending requests

### 🎨 UI/UX Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme Support**: Consistent styling across components
- **Loading States**: Smooth loading indicators and skeleton screens
- **Toast Notifications**: Real-time feedback for user actions
- **Modal Components**: Clean modal interfaces for stories, profile editing

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.1.1** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing and navigation

### State Management
- **Redux Toolkit** - Predictable state container
- **React Redux** - React bindings for Redux
- **Async Thunks** - Handling asynchronous actions

### Styling & UI
- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **Lucide React** - Beautiful and consistent icons
- **Custom CSS** - Additional styling for specific components

### Authentication & API
- **Clerk** - Complete authentication solution
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Elegant toast notifications

### Utilities
- **Moment.js** - Date and time manipulation
- **File Upload** - Image and video upload handling

## 📁 Project Structure

```
src/
├── api/
│   └── axios.js              # API configuration and base URL
├── app/
│   └── store.js              # Redux store configuration
├── assets/
│   ├── assets.js             # Asset imports and dummy data
│   └── images/               # Static image assets
├── components/
│   ├── Loading.jsx           # Loading spinner component
│   ├── MenuItems.jsx         # Navigation menu items
│   ├── PostCard.jsx          # Individual post component
│   ├── ProfileModel.jsx      # Profile editing modal
│   ├── RecentMessages.jsx    # Recent messages sidebar
│   ├── SideBar.jsx           # Main navigation sidebar
│   ├── StoriesBar.jsx        # Stories carousel
│   ├── StoryModel.jsx        # Story creation modal
│   ├── StoryViewer.jsx       # Story viewing modal
│   ├── UserCard.jsx          # User card component
│   └── UserProfileInfo.jsx   # User profile information
├── features/
│   ├── connections/
│   │   └── connectionSlice.js # Connection state management
│   ├── messages/
│   │   └── messageSlice.js    # Message state management
│   └── user/
│       └── userSlice.js       # User state management
├── pages/
│   ├── ChatBox.jsx           # Individual chat interface
│   ├── Connections.jsx       # Connections management page
│   ├── CreatePost.jsx        # Post creation page
│   ├── Discover.jsx          # User discovery page
│   ├── Feed.jsx              # Main news feed
│   ├── Layout.jsx            # Main layout wrapper
│   ├── Login.jsx             # Authentication page
│   ├── Messages.jsx          # Messages overview
│   └── Profile.jsx           # User profile page
├── App.jsx                   # Main application component
├── index.css                 # Global styles
└── main.jsx                  # Application entry point
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Backend server running (check server folder)

### Environment Variables
Create a `.env` file in the client directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BASE_URL=http://localhost:4000
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social_media/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.envSample` to `.env`
   - Add your Clerk publishable key
   - Set the backend API URL

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📦 Dependencies

### Main Dependencies
```json
{
  "@clerk/clerk-react": "^5.42.2",     // Authentication
  "@reduxjs/toolkit": "^2.8.2",        // State management
  "axios": "^1.11.0",                  // HTTP client
  "lucide-react": "^0.539.0",          // Icons
  "moment": "^2.30.1",                 // Date formatting
  "react": "^19.1.1",                  // React framework
  "react-dom": "^19.1.1",              // React DOM
  "react-hot-toast": "^2.6.0",         // Notifications
  "react-redux": "^9.2.0",             // Redux bindings
  "react-router-dom": "^6.30.1",       // Routing
  "tailwindcss": "^4.1.12"             // Styling
}
```

### Development Dependencies
- ESLint for code linting
- Vite plugins for React development
- TypeScript definitions

## 🔗 API Integration

The application integrates with a backend API through the following endpoints:

### User Endpoints
- `GET /api/users/data` - Fetch current user data
- `POST /api/users/update` - Update user profile
- `POST /api/users/profile` - Fetch user profile by ID

### Post Endpoints
- `GET /api/post/feed` - Fetch user feed
- `POST /api/post/add` - Create new post
- `POST /api/post/like` - Like/unlike post

### Story Endpoints
- `GET /api/story/get` - Fetch stories
- `POST /api/story/create` - Create new story

### Message Endpoints
- Various message-related endpoints for chat functionality

## 🎯 Key Features Breakdown

### Stories System
- **Creation**: Support for text, image, and video stories
- **Viewing**: Auto-progressing story viewer with manual controls
- **Expiry**: Stories automatically expire after 24 hours
- **Customization**: Text stories with color backgrounds

### Post System
- **Rich Content**: Text with image support
- **Hashtags**: Automatic hashtag detection and highlighting
- **Engagement**: Like system with real-time updates
- **Media**: Multiple image upload support

### Messaging
- **Real-time**: Live chat functionality
- **Media**: Support for image and text messages
- **Status**: Read/unread message indicators
- **Recent**: Quick access to recent conversations

### State Management
- **Redux Toolkit**: Centralized state management
- **Async Actions**: Proper handling of API calls
- **Error Handling**: Comprehensive error states
- **Loading States**: UI feedback for async operations

## 🔐 Authentication Flow

1. **Login**: Clerk handles OAuth and traditional login
2. **Token Management**: JWT tokens for API authentication
3. **User Context**: Global user state management
4. **Protected Routes**: Route protection based on auth state
5. **Session Persistence**: Automatic session restoration

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Adaptive layouts for tablets
- **Desktop**: Full-featured desktop experience
- **Touch Friendly**: Optimized touch interactions
- **Performance**: Optimized for various screen sizes

## 🚀 Performance Optimizations

- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Lazy loading and compression
- **Bundle Size**: Optimized bundle with tree shaking
- **Caching**: API response caching where appropriate
- **Lazy Loading**: Component lazy loading for better performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of a social media application. Please refer to the main repository for licensing information.

## 🐛 Known Issues & Future Improvements

### Current Issues
- Story viewer progress bar needs refinement
- Image upload validation could be enhanced
- Real-time messaging needs WebSocket integration

### Future Features
- Dark mode toggle
- Advanced search functionality
- Story highlights
- Group messaging
- Push notifications
- PWA support

## 📞 Support

For support and questions, please refer to the main project documentation or create an issue in the repository.

---

**Built with ❤️ using React, Redux, and Tailwind CSS**
