import './ChatBox.css';

function ChatBox({ messages, selectedUser, onlineUsers, isTyping }) {
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <div className="header-avatar">
          {selectedUser.username[0].toUpperCase()}
        </div>
        <div className="header-info">
          <h3>{selectedUser.username}</h3>
          {isTyping ? (
            <span className="typing-badge">typing...</span>
          ) : (
            <span className={`online-badge ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? '● Online' : '● Offline'}
            </span>
          )}
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="no-messages">
            <p>Say hello to {selectedUser.username}! 👋</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-row ${msg.fromMe ? 'me' : 'other'}`}
          >
            <span className={`message-bubble ${msg.fromMe ? 'me' : 'other'}`}>
              {msg.message}
            </span>
          </div>
        ))}

        {/* ✅ Typing indicator bubble */}
        {isTyping && (
          <div className="message-row other">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBox;