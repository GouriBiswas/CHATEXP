const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const axios = require('axios');
require('dotenv').config(); // for secure API key storage

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('userMessage', async (msg) => {
    console.log('User:', msg);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: msg }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Access API key from environment variable
          },
        }
      );

      const botReply = response.data.choices[0].message.content.trim();
      socket.emit('botMessage', botReply);
    } catch (error) {
      console.error('OpenAI error details:', error.response?.data || error.message);
      socket.emit('botMessage', 'Sorry, something went wrong 😕');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

http.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

