const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
app.use(cors());
const PORT = process.env.PORT || 5000;

// const http = require("http")
// const server = http.createServer(app)
// const io = require("socket.io")(server, {
//   cors: {
//     // origin: ["https://talkie-chat.vercel.app"],
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
//   }}
// )

require("dotenv").config();
// Cokkies Creation
app.use(cookieParser());
app.use(express.json());
app.use(require("./auth"));
app.use(express.static(path.resolve(__dirname, "frontend", "build")));



//socket io 
// io.on("connection",socket=>{
//   console.log("User Connected");
//   socket.on("disconnect",()=>{
//     console.log("User Disconnected")
//   });
//   socket.on('message', (msg) => {
//     console.log(msg);
//     io.emit('message', msg);
//     // socket.broadcast.emit('message',msg)
//   });

// })






app.get("/", (req, res) => {
  console.log(path.resolve(__dirname, "frontend", "build"));
  res.status(200).sendFile(path.resolve(__dirname, "frontend", "build"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/build/index.html"));
});

app.listen(5000, () => {
  console.log(`Server running at port ${PORT} `);
});
