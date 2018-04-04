var socket = io.connect(window.location.host);

socket.on('connected', function (data) {
    console.log(data);
    socket.emit('getUsersInRoom', {'room':'MainRoom'});
});

let btnSend = document.getElementById("btnSend");
let chatMessageTextBox = document.getElementById("chatMessageTextBox");
let chatMessagesList = document.getElementById("chatMessagesList");

btnSend.addEventListener("click", function() {
  let message = chatMessageTextBox.value;
  // emit means sending to the channel/room
  socket.emit("send message", message);
});


socket.on('newMessage', function (data) {
    console.log("newMessage: %s", JSON.stringify(data));
    addMessage(data);

    // Scroll down room messages
    var room_messages = '#room_messages_'+data.room;
    $(room_messages).animate({
        scrollTop: $(room_messages).prop('scrollHeight')
    }, 300);
});

// listening to that channel
socket.on("send message", function(message) {
  console.log(message)
  let chatMessageLI = document.createElement("li");
  chatMessageLI.innerHTML = JSON.stringify(message);
  chatMessagesList.appendChild(chatMessageLI);
});

socket.on('disconnect', function (data) {
    var info = {'room':'MainRoom', 'username':'ServerBot', 'msg':'----- Lost connection to server -----'};
    addMessage(info);
});

// Reconnected to server
socket.on('reconnect', function (data) {
    var info = {'room':'MainRoom', 'username':'ServerBot', 'msg':'----- Reconnected to server -----'};
    addMessage(info);
});
