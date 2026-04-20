require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin : '*' }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.log(err));

app.use('/api/auth', require('./routes/auth'));

const onlineUsers = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User comes online
  socket.on('addUser', (userId) => {
    onlineUsers[userId] = socket.id;
    io.emit('getOnlineUsers', Object.keys(onlineUsers));
  });

  // User sends message
  socket.on('sendMessage', ({ senderId, receiverId, message }) => {
    const receiverSocket = onlineUsers[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit('receiveMessage', {
        senderId,
        message
      });
    }
  });

  // ✅ Typing indicator
  socket.on('typing', ({ senderId, receiverId }) => {
    const receiverSocket = onlineUsers[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit('typing', { senderId });
    }
  });

  // ✅ Stop typing
  socket.on('stopTyping', ({ senderId, receiverId }) => {
    const receiverSocket = onlineUsers[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit('stopTyping', { senderId });
    }
  });

  // User disconnects
  socket.on('disconnect', () => {
    Object.keys(onlineUsers).forEach(key => {
      if (onlineUsers[key] === socket.id) {
        delete onlineUsers[key];
      }
    });
    io.emit('getOnlineUsers', Object.keys(onlineUsers));
    console.log('User disconnected:', socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});