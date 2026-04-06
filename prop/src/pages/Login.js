import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const saveAuth = (data) => {
    localStorage.setItem('userRole', data.role);
    localStorage.setItem('username', data.username);
    localStorage.setItem('token', data.token);
    window.dispatchEvent(new CustomEvent('userRoleChanged'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    const route = isRegister ? '/api/auth/register' : '/api/auth/login';
    try {
      const response = await fetch(route, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Unable to authenticate');
        setMessageType('error');
        return;
      }

      if (isRegister) {
        setMessage('Registration successful. You can now login with the same username and password.');
        setMessageType('success');
        setIsRegister(false);
        setPassword('');
        return;
      }

      saveAuth(data);
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      setMessage('Server error. Please try again later.');
      setMessageType('error');
    }
  };

  const submitLabel = isRegister ? 'Register' : 'Sign In';
  const promptText = isRegister ? 'Already have an account?' : 'New to BingeBox?';
  const promptAction = isRegister ? 'Login' : 'Create one';
  const subtitle = isRegister
    ? 'Join now to save favorites, track your activity, and watch anytime.'
    : 'Sign in to continue watching and managing your favorites.';
  const passwordHint = isRegister && password
    ? password.length >= 8
      ? 'Strong password — you are ready to submit.'
      : 'Try at least 8 characters for a stronger password.'
    : '';

  return (
    <div className="login-body">
      <div className="login-box">
        <h1>BingeBox</h1>
        <div className="login-toggle">
          <button
            type="button"
            className={!isRegister ? 'active' : ''}
            onClick={() => { setIsRegister(false); setMessage(''); }}
          >
            Login
          </button>
          <button
            type="button"
            className={isRegister ? 'active' : ''}
            onClick={() => { setIsRegister(true); setMessage(''); }}
          >
            Register
          </button>
        </div>
        <p className="login-subtitle">{subtitle}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={!username || !password}>{submitLabel}</button>
        </form>
        {username && !isRegister && (
          <p className="login-greeting">Hello, {username}! Ready to get back to your movies?</p>
        )}
        {passwordHint && <p className={`password-strength ${password.length >= 8 ? 'strong' : 'weak'}`}>{passwordHint}</p>}
        {message && <p className={`login-message ${messageType}`}>{message}</p>}
        <p className="help-text">
          {promptText}{' '}
          <span onClick={() => { setIsRegister(!isRegister); setMessage(''); }}>
            {promptAction}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;