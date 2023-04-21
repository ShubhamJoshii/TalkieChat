const express = require("express");
const app = express();

const mongoose = require("mongoose");
const { DBModel, ChatDataModel } = require("./Database");
const cookieParser = require("cookie-parser");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Add this
// Listen for when the client connects via socket.io-client
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on("sendMessage", (data) => {
    console.log(data);
    var User1_id = data.User1_id;
    var User2_id = data.User2_id;
    io.emit("messageReceived",data);
  });
});

require("dotenv").config();

// Cokkies Creation
app.use(cookieParser());

app.use(express.json());

app.use(require("./auth"));

const PORT = process.env.PORT || 5000;

app.use(express.static(path.resolve(__dirname, "frontend", "build")));
app.get("/", (req, res) => {
  console.log(path.resolve(__dirname, "frontend", "build"));
  res.status(200).sendFile(path.resolve(__dirname, "frontend", "build"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/build/index.html"));
});

server.listen(5000, () => {
  console.log(`Server running at port ${PORT} `);
});
