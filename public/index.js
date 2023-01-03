const socket = io("ws://localhost:3001");

let clientRoom;

socket.on("serverMsg", (data) => {
  console.log(`I should be in room No. ${data}`);
  clientRoom = data;
});


