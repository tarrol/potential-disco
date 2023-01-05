const socket = io("ws://localhost:3001");
const joinBtn = document.querySelector("#join-btn");

// let clientRoom;

function joinRoom() {
  socket.on("join", (data) => {
    console.log(`I should be in room No. ${data}`);
    // clientRoom = data;
  });
  console.log("joinRoom called");
}
joinBtn.addEventListener("click", joinRoom());

// socket.on("connection", (data) => {
//   console.log(`I should be in room No. ${data}`);
// });
