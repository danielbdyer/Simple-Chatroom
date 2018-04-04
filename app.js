var express = require("express");
var http = require("http");
var app = express();
var bodyParser = require("body-parser")

var server = http.createServer(app);
var io = require("socket.io")(server);
var redis = require('socket.io-redis');

var events = require('events')

var conf = {
  dbPort: '6379',
  dbHost: '127.0.0.1',
  dboptions: {},
  mainroom: 'MainRoom',
  port: (process.env.PORT || '3000')
}

server.listen(conf.port, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/static'));

io.adapter(redis({ host: conf.dbHost, port: conf.dbPort }));

var db = require('redis').createClient(conf.dbPort,conf.dbHost);

var logger = new events.EventEmitter();
logger.on('newEvent', function(event, data) {
    console.log('%s: %s', event, JSON.stringify(data));
});

let users = [];
let activeSockets = [];

// setting up the javascript file as a static resource
app.use("/static", express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.sockets.on("connection", socket => {

  socket.emit('connected', 'Welcome to the chat server');
  logger.emit('newEvent', 'userConnected', {'socket':socket.id});

  db.hset([socket.id, 'connectionDate', new Date()], redis.print);
  db.hset([socket.id, 'socketID', socket.id], redis.print);
  db.hset([socket.id, 'username', 'anonymous'], redis.print);

  socket.join(conf.mainroom)

  logger.emit('newEvent', 'userJoinsRoom', {'socket':socket.id, 'room':conf.mainroom});
  socket.emit('subscriptionConfirmed', {'room':conf.mainroom});

  var data = {'room':conf.mainroom, 'username':'anonymous', 'msg':'----- Joined the room -----', 'id':socket.id};
  io.to(conf.mainroom).emit('userJoinsRoom', data);

  socket.on('disconnect', data => {
    users.splice(users.indexOf(socket.username), 1);
    io.sockets.emit('get users', users)
    activeSockets.splice(activeSockets.indexOf(socket), 1);

    console.log("Socket with %s id just left", socket.id)
    console.log("%s sockets still connected", activeSockets.length);
  });

  socket.on("send message", data => {
    console.log(data);
    io.emit("send message", {msg: data.msg, user: socket.username});
  });

  socket.on("new user", (userData, callback) => {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    io.sockets.emit('get users', users);
  })
});
