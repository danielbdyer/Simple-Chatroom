var app = require("express")();
const express = require("express");
var http = require("http").Server(app);

// io is socket.io instance
var io = require("socket.io")(http);

// setting up the javascript file as a static resource
app.use("/static", express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  console.log("a user has connected");

  socket.on("digitalcrafts2018", function(message) {
    console.log(message);
    io.emit("digitalcrafts2018", message);
  });

  /*
  socket.on('chat message', function(msg){
    console.log(msg)
    io.emit('chat message',msg)
  }) */
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
