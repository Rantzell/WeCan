const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve everything in /public (index.html, css, images)
app.use(express.static(path.join(__dirname, "public")));

// Fallback to the landing page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`WeCan landing running at http://localhost:${PORT}`);
});
