const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
app.use(cors());
const PORT = process.env.PORT || 5000;

require("dotenv").config();
// Cokkies Creation
app.use(cookieParser());
app.use(express.json());
app.use(require("./auth"));
app.use(express.static(path.resolve(__dirname, "frontend", "dist")));

app.get("/", (req, res) => {
  console.log(path.resolve(__dirname, "frontend", "dist"));
  res.status(200).sendFile(path.resolve(__dirname, "frontend", "dist"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/dist/index.html"));
});

app.listen(5000, () => {
  console.log(`Server running at port ${PORT} `);
});