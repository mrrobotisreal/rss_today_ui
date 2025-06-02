# RSS Today - Frontend

A modern React TypeScript application for monitoring RSS feeds with real-time alerts and Firebase authentication.

## Features

- 🔐 **Firebase Authentication** - Secure login and registration
- 📰 **Article Monitoring** - Real-time RSS feed monitoring
- 🔔 **Custom Alerts** - Keyword-based notifications
- 📊 **Source Management** - View and manage RSS sources
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS and Shadcn components

## Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project (for authentication)
- RSS Today API running (see backend setup)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password
3. Get your Firebase configuration
4. Update `src/lib/firebase.ts` with your Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Backend API

Make sure the RSS Today API is running on `http://localhost:3001`. See the `github.com/mrrobotisreal/rss_today_api` repo for backend setup instructions.

### 4. Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   │   ├── AuthWrapper.tsx
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── ui/             # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── Dashboard.tsx   # Main dashboard component
├── contexts/
│   └── AuthContext.tsx # Authentication state management
├── lib/
│   ├── firebase.ts     # Firebase configuration
│   └── utils.ts        # Utility functions
├── services/
│   └── api.ts          # API service layer
├── App.tsx             # Main app component
└── main.tsx           # App entry point
```

## API Integration

The application integrates with the following backend endpoints:

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/verify` - Token verification

### Protected Routes (require authentication)
- `GET /api/articles` - Fetch articles
- `GET /api/sources` - Fetch RSS sources
- `GET /api/alerts` - Get user alerts
- `POST /api/alerts` - Create new alert
- `POST /api/monitor/trigger` - Trigger manual monitoring

## Environment Configuration

The API base URL is configured in `src/services/api.ts`. Update if your backend runs on a different port:

```typescript
const API_BASE_URL = 'http://localhost:3001';
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication Flow

1. User registers or logs in through Firebase
2. Firebase returns an ID token
3. Token is sent to backend for verification
4. Backend returns user information
5. Token is used for all subsequent API calls

## Components Overview

### AuthWrapper
Manages switching between login and registration forms.

### LoginForm / RegisterForm
Handle user authentication with form validation and error handling.

### Dashboard
Main application interface with three tabs:
- **Articles**: Browse and filter news articles
- **Alerts**: Create and manage keyword alerts
- **Sources**: View RSS sources

### API Service
Centralized service for all backend API calls with proper error handling and authentication headers.

## Development Notes

- Uses TypeScript for type safety
- Tailwind CSS for styling
- Shadcn/ui for component library
- Firebase for authentication
- Vite for build tooling

## Troubleshooting

### Common Issues

1. **Firebase Configuration Error**
   - Ensure Firebase config is properly set in `src/lib/firebase.ts`
   - Check that Authentication is enabled in Firebase Console

2. **API Connection Error**
   - Verify the backend API is running on port 3001
   - Check CORS settings if making requests from different domain

3. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check for TypeScript errors with `npm run lint`

### CORS Issues

If you encounter CORS issues during development, the backend API includes CORS headers. Make sure the API is running and accessible.

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting service

3. Update API base URL for production environment

4. Ensure Firebase configuration is set for production domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
