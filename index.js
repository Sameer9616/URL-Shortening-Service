const express = require("express");
const bodyParser = require("body-parser");
const { deleteExpiredURLs } = require("./controllers/url");

const app = express();
app.use(bodyParser.json());

const PORT = 8081;

const userRoute = require("./routes/user");
const urlRoute = require("./routes/url");
const analyticsRoute = require("./routes/analytics");

const URL = require("./models/url");

app.use(express.json());

app.use("/user", userRoute);
app.use("/url", urlRoute);
app.use("/analytics", analyticsRoute);

app.get("/", (req, res) => {
  res.send(`Welcome to URL Shortening Service`);
});

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  try {
    console.log(req.headers["user-agent"]);
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
            userAgent: req.headers["user-agent"],
          },
        },
      },
      { new: true }
    );

    if (!entry) {
      return res.status(404).send("URL not found");
    }

    // Check for URL expiration
    if (entry.expirationDate && entry.expirationDate < new Date()) {
      return res.status(410).send("URL has expired");
    }

    // Redirect user to the original URL
    res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

setInterval(deleteExpiredURLs, 86400000);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
