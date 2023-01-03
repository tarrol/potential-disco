const socket = io("ws://localhost:3001");

socket.on("connect", () => {
  console.log("Connected");
});
