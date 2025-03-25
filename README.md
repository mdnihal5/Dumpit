# DumpIt - Construction Materials Ordering Platform

DumpIt is a full-stack application for ordering construction raw materials from local suppliers, similar to food delivery platforms like Zomato/Swiggy but specialized for the construction industry.

## Project Overview

DumpIt connects construction material buyers with local suppliers, providing a seamless ordering and delivery experience for construction materials.

### Features

- **User App**: Browse and order construction materials with real-time tracking
- **Vendor Panel**: Manage product listings, inventory, and orders
- **Admin Dashboard**: Platform management and analytics
- **Delivery Partner Panel** (Phase 2): Order delivery management

## Tech Stack

### Frontend

- React Native (Expo) - Mobile application
- React.js - Admin and Vendor panels
- TailwindCSS/NativeWind - Styling
- Redux Toolkit / Zustand - State management
- React Query - Data fetching

### Backend

- Node.js with Express - REST API
- MongoDB with Mongoose - Database
- JWT + Refresh Tokens - Authentication
- Firebase Cloud Messaging - Notifications
- AWS S3 / Firebase Storage - File storage
- Redis - Caching and rate limiting

## Project Structure

```
DumpIt/
├── backend/                # Express.js backend API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── config/         # Configuration files
│   │   └── server.js       # Entry point
│   └── tests/              # Backend tests
├── mobile/                 # React Native mobile app
│   ├── src/
│   │   ├── screens/        # App screens
│   │   ├── components/     # Reusable components
│   │   ├── navigation/     # Navigation configuration
│   │   ├── services/       # API services
│   │   ├── store/          # State management
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   └── assets/         # Images, fonts, etc.
└── admin/                  # React admin dashboard
    └── src/
        ├── pages/          # Admin pages
        ├── components/     # UI components
        ├── services/       # API services
        ├── store/          # State management
        ├── hooks/          # Custom hooks
        ├── utils/          # Utility functions
        └── assets/         # Images, icons, etc.
```

## Getting Started

### Prerequisites

- Node.js 16+
- MongoDB
- Redis (optional for production)

### Backend Setup

1. Navigate to backend directory: `cd DumpIt/backend`
2. Install dependencies: `npm install`
3. Copy environment file: `cp .env.example .env`
4. Configure your environment variables in `.env`
5. Start the development server: `npm run dev`

### Mobile App Setup

1. Navigate to mobile directory: `cd DumpIt/mobile`
2. Install dependencies: `npm install`
3. Start the Expo development server: `npm start`

### Admin Dashboard Setup

1. Navigate to admin directory: `cd DumpIt/admin`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## API Documentation

API documentation is available at `/api/docs` when the server is running.

## License

[MIT License](LICENSE)
