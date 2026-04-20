import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      setMessage(res.data.message);
      if (res.data.success) {
        login(res.data.user, res.data.token);
        navigate('/chat');
      }
    } catch (err) {
      setMessage('Something went wrong!');
    }
  };

  return (
    <div className="login-container">

      {/* Left Side */}
      <div className="login-left">
        <div className="left-top">
          <div className="brand-logo">💬</div>
          <h1>Chat with<br /><span>anyone,</span><br />anywhere.</h1>
          <p>A fast, secure and modern messaging platform built for real conversations.</p>
        </div>
        <div className="feature-list">
          <div className="feature-item">
            <div className="f-icon">⚡</div>
            <span>Real-time messaging with instant delivery</span>
          </div>
          <div className="feature-item">
            <div className="f-icon">🔒</div>
            <span>End-to-end encrypted conversations</span>
          </div>
          <div className="feature-item">
            <div className="f-icon">🌐</div>
            <span>See who's online with live status</span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="login-right">
        <p className="eyebrow">Welcome back</p>
        <h2>Sign in to ChatApp</h2>
        <p className="subtitle">Enter your credentials to continue to your account</p>

        <div className="form-group">
          <label>Email address</label>
          <input
            name='email'
            placeholder='you@example.com'
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            name='password'
            type='password'
            placeholder='Enter your password'
            onChange={handleChange}
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Sign In →
        </button>

        {message && <p className="error-msg">{message}</p>}

        <div className="divider"><span>or</span></div>

        <p className="footer-text">
          Don't have an account? <a href='/register'>Create one free</a>
        </p>
      </div>

    </div>
  );
}

export default Login;