import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import UserList from '../components/UserList';
import ChatBox from '../components/Chatbox';
import MessageInput from '../components/MessageInput';
import './Chat.css';

const socket = io(process.env.REACT_APP_BACKEND_URL);

function Chat() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    socket.emit('addUser', user.id);

    socket.on('getOnlineUsers', (users) => {
      setOnlineUsers(users);
    });

    socket.on('receiveMessage', ({ senderId, message }) => {
      setMessages(prev => [...prev, { senderId, message, fromMe: false }]);
    });

    // ✅ Typing events
    socket.on('typing', () => {
      setIsTyping(true);
    });

    socket.on('stopTyping', () => {
      setIsTyping(false);
    });

    const token = localStorage.getItem('token');
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/users`, {
      headers: { authorization: token }
    }).then(res => {
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      }
    });

    return () => {
      socket.off('getOnlineUsers');
      socket.off('receiveMessage');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, [user]);

  const handleSend = (message) => {
    socket.emit('sendMessage', {
      senderId: user.id,
      receiverId: selectedUser._id,
      message
    });
    setMessages(prev => [...prev, { senderId: user.id, message, fromMe: true }]);
  };

  const handleTyping = () => {
    socket.emit('typing', {
      senderId: user.id,
      receiverId: selectedUser._id
    });
  };

  const handleStopTyping = () => {
    socket.emit('stopTyping', {
      senderId: user.id,
      receiverId: selectedUser._id
    });
  };

  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setMessages([]);
    setIsTyping(false);
  };

  if (!user) return null;

  return (
    <div className="chat-container">
      <UserList
        users={users}
        selectedUser={selectedUser}
        setSelectedUser={handleSelectUser}
        onlineUsers={onlineUsers}
      />
      <div className="chat-right">
        {selectedUser ? (
          <>
            <ChatBox
              messages={messages}
              selectedUser={selectedUser}
              onlineUsers={onlineUsers}
              isTyping={isTyping}
            />
            <MessageInput
              onSend={handleSend}
              onTyping={handleTyping}
              onStopTyping={handleStopTyping}
            />
          </>
        ) : (
          <div className="no-chat">
            <div className="no-chat-icon">💬</div>
            <h3>Select a conversation</h3>
            <p>Choose someone from the left to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;