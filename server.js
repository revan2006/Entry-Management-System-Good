var express = require("express");
var env     = process.env.NODE_ENV || "development";
var app     = express();
var config  = require('./server/config/config')[env];
var http  = require('http').Server(app);
var io      = require('socket.io')(http);

require('./server/config/express')(app,config);

require('./server/config/mongoose')(config);

require('./server/config/passport')();

require('./server/config/routes')(app,io);

http.listen(config.port);