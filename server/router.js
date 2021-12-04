require("dotenv").config();
var express = require("express");
var app = express();

const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
global.io = socketIo(server);

var terms = require("./routes/terms.js");
app.use("/terms", terms);

var streaming = require("./routes/streaming.js");
app.use("/stream", streaming);

var maps = require("./routes/maps.js");
app.use("/map", maps);

var index = require("./routes/index.js");
app.use("/index", index);

var users = require("./routes/users.js");
app.use("/users", users);

server.listen(8000, console.log("listening on 8000"));

// io.on("connection", (socket) => {
//   console.log("user connected");

//   socket.on("start-stream", () => {
//     console.log("stream starting");
//     startStream(socket);
//   });
//   socket.on("end-stream", () => {
//     console.log("stream closing");
//     stream.close();
//   });
// });
