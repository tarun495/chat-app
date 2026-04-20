import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      setMessage(res.data.message);
      if (res.data.success) {
        setIsError(false);
        setTimeout(() => navigate('/login'), 1000);
      } else {
        setIsError(true);
      }
    } catch (err) {
      setIsError(true);
      setMessage('Something went wrong!');
    }
  };

  return (
    <div className="register-container">

      {/* Left Side */}
      <div className="register-left">
        <div className="left-top">
          <div className="brand-logo">💬</div>
          <h1>Join the<br /><span>conversation</span><br />today.</h1>
          <p>Create your free account and start connecting with people in real time.</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="register-right">
        <p className="eyebrow">Get started</p>
        <h2>Create your account</h2>
        <p className="subtitle">Fill in the details below to get started for free</p>

        <div className="form-group">
          <label>Username</label>
          <input
            name='username'
            placeholder='Choose a username'
            onChange={handleChange}
          />
        </div>
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
            placeholder='Create a strong password'
            onChange={handleChange}
          />
        </div>

        <button className="register-btn" onClick={handleRegister}>
          Create Account →
        </button>

        {message && (
          <p className={isError ? 'error-msg' : 'success-msg'}>{message}</p>
        )}

        <p className="footer-text">
          Already have an account? <a href='/login'>Sign in</a>
        </p>
      </div>

    </div>
  );
}

export default Register;