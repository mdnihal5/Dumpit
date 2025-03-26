const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const errorHandler = require("./middlewares/error.middleware");
const ErrorResponse = require("./utils/errorResponse");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const vendorRoutes = require("./routes/vendor.routes");
const paymentRoutes = require("./routes/payment.routes");
const categoryRoutes = require("./routes/category.routes");
const reviewRoutes = require("./routes/review.routes");
const settingsRoutes = require("./routes/settings.routes");

// Create Express app
const app = express();

// Apply security middleware
app.use(helmet());
app.use(cors({
  origin: true ,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dumpit")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/settings", settingsRoutes);

// Base route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DumpIt API is running",
    version: "1.0.0",
  });
});

// Handle 404 - Route not found
app.use((req, res, next) => {
  const error = new ErrorResponse(`Route not found - ${req.originalUrl}`, 404);
  next(error);
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
  console.log(`API available at http://${HOST === '0.0.0.0' ? '100.78.134.5' : HOST}:${PORT}/api`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});

// For testing purposes
module.exports = app;
