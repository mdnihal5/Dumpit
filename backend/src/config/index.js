require('dotenv').config()

const config = {
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/dumpit',
  },
  jwt: {
    secret: process.env.JWT_SECRET || '@dumpitv1',
    expire: process.env.JWT_EXPIRE || '7d',
    cookieExpire: process.env.JWT_COOKIE_EXPIRE || 7,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_FOLDER || 'dumpit',
  },
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
    fromName: process.env.EMAIL_FROM_NAME || 'Dumpit',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },
  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
}

module.exports = config
