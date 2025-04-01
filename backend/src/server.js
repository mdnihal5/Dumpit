const config = require("./config");
const connectDB = require("./config/db");

connectDB();

const app = require("./app");
const PORT = config.server.port;

app.listen(PORT, () =>
  console.log(`Server running in ${config.server.nodeEnv} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
