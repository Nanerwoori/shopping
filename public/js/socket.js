// const socket = io("http://localhost:5000");

// const chatBtn = document.querySelector("#chat-btn");
// const chatContainer = document.querySelector(".chat-container");
// const chatArea = document.querySelector("#chat-area");
// const chatForm = document.querySelector("#chat-form");

// const openChat = () => {
//   chatContainer.classList.add("open");
//   fetch("http://localhost:5000/chat")
//     .then(data => {
//       console.log("콜...");
//       return;
//     })
//     .catch(err => console.log(err));
// };

// const handleSubmit = e => {
//   e.preventDefault();

//   const chatMessage = chatForm.querySelector("#chat-message").value;
//   if (chatMessage.trim() === "") {
//     console.log("입력 필수!");
//     return;
//   }
//   console.log(chatMessage);
//   socket.emit("send", chatMessage);
// };

// socket.on("user", data => {
//   console.log(data);
// });

// chatBtn.addEventListener("click", openChat);
// chatForm.addEventListener("submit", handleSubmit);
