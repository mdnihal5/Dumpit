# DumpIt Backend API

Backend for construction material ordering platform.

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Route handlers and business logic
│   ├── middlewares/      # Express middlewares  
│   ├── models/           # Mongoose database models
│   ├── routes/           # Express routes
│   ├── utils/            # Utility functions
│   └── server.js         # Express app and server entry point
├── .env                  # Environment variables (not committed)
├── .env.example          # Example environment variables
└── package.json          # NPM dependencies and scripts
```

## Error Handling

The application uses a comprehensive error handling strategy:

1. **AsyncHandler**: All asynchronous route handlers are wrapped with the `asyncHandler` utility to automatically catch and forward errors to Express error handler.

2. **Custom Error Response**: A custom `ErrorResponse` class extends the native Error object to include HTTP status codes.

3. **Global Error Middleware**: Centralized error handling middleware processes all errors and formats responses.

4. **Detailed Error Types**: Specific handling for different error types, including:
   - Mongoose validation errors
   - JWT authentication errors
   - Database errors
   - File upload errors

5. **Logging**: A dedicated logger utility provides consistent, environment-aware logging.

## API Authentication

The API uses JWT tokens for authentication:

- **Access Token**: Short-lived token for API requests
- **Refresh Token**: Longer-lived token for refreshing access tokens

## Environment Variables

See `.env.example` for required environment variables.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

API endpoints are organized by resource:

- `/api/auth` - Authentication and user management
- `/api/users` - User operations
- `/api/products` - Product operations
- `/api/orders` - Order management
- `/api/vendors` - Vendor operations
- `/api/payments` - Payment processing
- `/api/categories` - Category management
- `/api/reviews` - Product reviews
- `/api/settings` - Application settings

## Technologies Used

- **Node.js & Express.js**: Server and API framework
- **MongoDB**: Database for storing application data
- **Razorpay**: Payment processing
- **Cloudinary**: Cloud storage for images and files
- **Nodemailer**: Email notifications
- **JWT**: Authentication

## Environment Configuration

Copy `.env.example` to `.env` and fill in your values:

```
# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/dumpit

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d

# Email (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=support@dumpit.com

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_FOLDER=dumpit
```

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## API Endpoints

### Auth
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/profile - Get user profile

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get product by ID
- POST /api/products - Create new product (admin)
- PUT /api/products/:id - Update product (admin)
- DELETE /api/products/:id - Delete product (admin)

### Orders
- GET /api/orders - Get user orders
- GET /api/orders/:id - Get order by ID
- POST /api/orders - Create new order
- PUT /api/orders/:id/status - Update order status (admin)

### Payments
- POST /api/payments/create-payment-intent - Initialize payment
- POST /api/payments/verify-payment - Verify Razorpay payment
- GET /api/payments/my-payments - Get user payment history

## File Storage

Files are stored using Cloudinary cloud storage. The file upload utility is in `utils/cloudinaryUpload.js` and provides the following functions:

- `uploadToCloudinary(file, folder)` - Upload a single file
- `uploadMultipleToCloudinary(files, folder)` - Upload multiple files
- `deleteFromCloudinary(fileUrl)` - Delete a file from storage

Example usage:

```javascript
const { upload, uploadToCloudinary } = require('../utils/cloudinaryUpload');

// In a route handler
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const fileUrl = await uploadToCloudinary(req.file, 'products');
    res.status(200).json({ success: true, fileUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
``` 