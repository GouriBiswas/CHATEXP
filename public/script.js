const socket = io();
const messages = document.getElementById('messages');
const input = document.getElementById('input');

function sendMessage() {
  const msg = input.value;
  if (!msg.trim()) return;
  appendMessage("You: " + msg);
  socket.emit('userMessage', msg);
  input.value = '';
}

socket.on('botMessage', (msg) => {
  appendMessage("Bot: " + msg);
});

function appendMessage(msg) {
  const div = document.createElement('div');
  div.textContent = msg;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}
