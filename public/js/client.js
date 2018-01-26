let socket = io();

let btnSend = document.getElementById("btnSend");
let chatMessageTextBox = document.getElementById("chatMessageTextBox");
let chatMessagesList = document.getElementById("chatMessagesList");

btnSend.addEventListener("click", function() {
  let message = chatMessageTextBox.value;
  // emit means sending to the channel/room
  socket.emit("digitalcrafts2018", message);
});

// listening to that channel
socket.on("digitalcrafts2018", function(message) {
  let chatMessageLI = document.createElement("li");
  chatMessageLI.innerHTML = message;
  chatMessagesList.appendChild(chatMessageLI);
});

/*
let btnSend = document.getElementById("btnSend")
btnSend.addEventListener('click',function(){
  let chatMessage = chatMessageTextBox.value
  socket.emit('chat message',chatMessage)
})


socket.on('chat message',function(message){

  let li = document.createElement("li")
  li.innerHTML = message
  chatMessages.appendChild(li)

})

// update users count
socket.on('update users count',function(count){
  totalUsersCountHeading.innerHTML = count
}) */
