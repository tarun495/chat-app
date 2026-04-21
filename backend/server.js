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

app.use(cors({ origin: '*' }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.log(err));

// ✅ Add test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.use('/api/auth', require('./routes/auth'));

const onlineUsers = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('addUser', (userId) => {
    onlineUsers[userId] = socket.id;
    io.emit('getOnlineUsers', Object.keys(onlineUsers));
  });

  socket.on('sendMessage', ({ senderId, receiverId, message }) => {
    const receiverSocket = onlineUsers[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit('receiveMessage', { senderId, message });
    }
  });

  socket.on('typing', ({ senderId, receiverId }) => {
    const receiverSocket = onlineUsers[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit('typing', { senderId });
    }
  });

  socket.on('stopTyping', ({ senderId, receiverId }) => {
    const receiverSocket = onlineUsers[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit('stopTyping', { senderId });
    }
  });

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

// ✅ Added fallback port
server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});