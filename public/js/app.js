const socket = io();

const chatForm = document.querySelector("#chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.querySelector("#room-name");
const usersList = document.querySelector("#users");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("joinRoom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outPutUsers(users);
});

socket.on("message", (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg;
  socket.emit("chatMessage", msg.value);
  msg.value = "";
  msg.focus();
});

const outputMessage = ({ text, time, username }) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${username} <span>${time}</span></p>
    <p class="text">
      ${text}
    </p>`;

  document.querySelector(".chat-messages").appendChild(div);
};

const outputRoomName = (room) => (roomName.textContent = room);

const outPutUsers = (users) => {
    usersList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join("")}
    `
};
