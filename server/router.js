var express = require('express')
var app = express()

var terms = require('./routes/terms.js')
app.use('/terms', terms)

var streaming = require('./routes/streaming.js')
app.use('/stream', streaming)

var maps = require('./routes/maps.js')
app.use('/map', maps)

var index = require('./routes/index.js')
app.use('/index', index)

var users = require('./routes/users.js')
app.use('/users', users)

const http = require('http')
const server = http.createServer(app)

server.listen(8000, console.log("listening on 8000"));
