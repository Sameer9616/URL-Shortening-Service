const shortid = require("shortid");
const URL = require("../models/url");
const UAParser = require("ua-parser-js");

// Function to handle generating a new short URL
async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  console.log(req.headers);
  if (!body.url) return res.status(400).json({ error: `URL is required` });

  const shortID = shortid.generate();

  const userAgent = req.headers["user-agent"];
  const parser = new UAParser();
  const parsedUserAgent = parser.setUA(userAgent).getResult();

  const browser = parsedUserAgent.browser.name || "Unknown";
  const device = parsedUserAgent.device.type || "Unknown";
  const referralSource = req.headers.referer || "Direct";

  // Calculate expiration date (e.g., 30 days from now)
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30); // Adjust based on your desired expiration period

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [
      {
        timestamp: new Date(),
        userAgent: userAgent,
        referralSource: referralSource,
      },
    ],
    browser: browser,
    device: device,
    expirationDate: expirationDate, // Add expiration date to the document
  });

  return res.json({ Id: shortID });
}

// Function to handle analytics
async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;

  try {
    const result = await URL.findOne({ shortId });

    if (!result) {
      return res.status(404).json({ error: "URL not found" });
    }

    console.log(req.headers["user-agent"]);
    const analytics = result.visitHistory.map((entry) => {
      const parsedUserAgent = new UAParser(entry.userAgent).getResult();

      return {
        timestamp: entry.timestamp,
        browser: parsedUserAgent.browser.name || "Unknown",
        device: parsedUserAgent.device.type || "Unknown",
        referralSource: entry.referralSource || "Direct",
      };
    });

    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: analytics,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Periodic task to delete expired URLs
async function deleteExpiredURLs() {
  try {
    // Find and delete URLs where expirationDate is less than or equal to current date
    await URL.deleteMany({ expirationDate: { $lte: new Date() } });
    console.log("Expired URLs deleted successfully.");
  } catch (error) {
    console.error("Error deleting expired URLs:", error);
  }
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  deleteExpiredURLs,
};
