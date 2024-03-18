const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connection established");
  })
  .catch((error) => {
    console.log("Error in connection:", error);
  });

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },
    visitHistory: [
      {
        timestamp: { type: Number },
        userAgent: { type: String },
      },
    ],
    expirationDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const URL = mongoose.model("url", urlSchema);

// Function to periodically check and delete expired URLs
async function checkAndDeleteExpiredURLs() {
  try {
    const currentDate = new Date();
    await URL.deleteMany({ expirationDate: { $lt: currentDate } });
    console.log("Expired URLs deleted successfully");
  } catch (error) {
    console.error("Error deleting expired URLs:", error);
  }
}

// Schedule to run the expiration check daily
setInterval(checkAndDeleteExpiredURLs, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

module.exports = URL;
