const express = require("express")
const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(3000)
module.export = io;
