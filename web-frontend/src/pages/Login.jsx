
import React, { useState } from 'react';
import { loginMock } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState('demo@example.com');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onLogin = async () => {
    try {
      const { token, user } = await loginMock(email);
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      navigate('/');
    } catch (e) {
      setError('Impossible de se connecter');
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>BonPartage - Web (Beta)</h2>
        <p>Connecte-toi (mock)</p>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
        {error && <div style={{color:'red'}}>{error}</div>}
        <button className="button" onClick={onLogin}>Se connecter</button>
      </div>
    </div>
  )
}
