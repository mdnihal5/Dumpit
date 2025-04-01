const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const compression = require("compression");
const fileUpload = require("express-fileupload");
const path = require("path");
const { errorHandler } = require("./middlewares/error.middleware");
const config = require("./config");

// Import routes
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const shopRoutes = require("./routes/shop.routes");
const orderRoutes = require("./routes/order.routes");
const notificationRoutes = require("./routes/notification.routes");
const cartRoutes = require("./routes/cart.routes");
const trackingRoutes = require("./routes/tracking.routes");
const addressRoutes = require("./routes/address.routes");

// Initialize express
const app = express();

// Body parser
app.use(express.json());
app.use(cookieParser());
if (config.server.nodeEnv === "development") {
  app.use(morgan("dev"));
}
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: config.cors.frontendUrl,
    credentials: true,
  })
);
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(hpp());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

// File upload
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, '../public')));

// Create upload folder if it doesn't exist
const fs = require('fs');
const uploadDir = path.join(__dirname, '../public/uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/auth/addresses", addressRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/tracking", trackingRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Dumpit API is running...");
});

// Error handler middleware
app.use(errorHandler);

module.exports = app;
