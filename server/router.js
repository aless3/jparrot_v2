var express = require('express')
var app = express()

var terms = require('./routes/terms.js')
app.use('/', terms)

var streaming = require('./routes/streaming.js')
app.use('/stream', streaming)

const http = require('http')
const server = http.createServer(app)

server.listen(8000, console.log("listening on 8000"));
