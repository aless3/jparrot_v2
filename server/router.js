require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors")
app.use(cors())

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
global.io = new Server(server);

const terms = require("./routes/terms.js");
app.use("/terms", terms.router);

const maps = require("./routes/maps.js");
app.use("/map", maps.router);

const sentiment = require("./routes/sentiment.js");
app.use("/sentiment", sentiment.router);

const keyword = require("./routes/keyword");
app.use("/keyword", keyword.router);

const competition = require("./routes/competition");
app.use("/competition", competition.router)

const index = require("./routes/index.js");
app.use("/index", index);

server.listen(8000, () => {
  console.log("listening on 8000");
});

const streaming = require("./routes/streaming.js");
app.use("/stream", streaming.router);

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("start-stream", async (text) => {
    console.log("stream starting");
    await streaming.startStream([text], socket);
  });

  socket.on("end-stream", () => {
    console.log("stream closing");
    streaming.closeStream();
  });
});
