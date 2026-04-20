import { useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import './MessageInput.css';

function MessageInput({ onSend, onTyping, onStopTyping }) {
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const typingTimeout = useRef(null);

  const handleChange = (e) => {
    setMessage(e.target.value);
    onTyping();
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      onStopTyping();
    }, 1500);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage('');
    setShowEmoji(false);
    onStopTyping();
  };

  const onEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  return (
    <div className="input-wrapper">
      {showEmoji && (
        <div className="emoji-picker-wrapper">
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            height={380}
            width={320}
            searchDisabled={false}
            skinTonesDisabled={true}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

      <div className="message-input-container">
        <button
          className="emoji-btn"
          onClick={() => setShowEmoji(!showEmoji)}
        >
          😊
        </button>

        <input
          value={message}
          onChange={handleChange}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder='Type a message...'
        />

        <button className="send-btn" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default MessageInput;