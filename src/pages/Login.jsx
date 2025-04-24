import React, { useState } from 'react';
import { isParallel } from '../utils/settings';
import { check_if_email_registered, setUser } from '../utils/auth';
import { useNavigate } from "react-router-dom";

function AuthFlow({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');
  const [step, setStep] = useState('email');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const isRegistered = await check_if_email_registered(email);
      
      if(isRegistered) {
        setStep('login');
      } else {
        await sendVerificationCode();
        setStep('send_code');
      }
      setError('');
    } catch(err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationCode = async () => {
    const url = isParallel() ? "/api/send_code/" : "http://localhost:8000/api/send_code/";
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if(!response.ok) throw new Error('Ошибка отправки кода');
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const url = isParallel() ? "/api/check_code/" : "http://localhost:8000/api/check_code/";
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      if(!response.ok) throw new Error('Неверный код');
      
      const data = await response.json();
      setToken(data.token);
      setStep('register');
      setError('');
    } catch(err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const url = isParallel() ? "/api/login" : "http://localhost:8000/api/login";
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if(!response.ok) throw new Error('Неверные данные');
      
      const data = await response.json();
      setUser(data.access_token);
      onLogin();
      navigate("/");
    } catch(err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const url = isParallel() ? "/api/register/" : "http://localhost:8000/api/register/";
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          username,
          password,
          token: token 
        })
      });
      // TODO: СДЕЛАЙ РАЗНЫЕ СООБЩЕНИЯ ДЛЯ РАЗНЫХ ОШИБОК
      if(!response.ok) throw new Error('Ошибка регистрации');
      
      const data = await response.json();
      setUser(data.access_token);
      onLogin();
      navigate("/");
    } catch(err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if(step !== 'email') setStep('email');
            }}
            placeholder="Ваш email"
            className="flex-1 p-2 border rounded"
            required
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="px-4 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            →
          </button>
        </div>
      </form>

      {error && <div className="p-2 text-red-600 bg-red-100 rounded">{error}</div>}

      {step === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            Войти
          </button>
        </form>
      )}

      {step === 'send_code' && (
        <form onSubmit={handleCodeSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Код из письма"
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-2 bg-yellow-500 text-white rounded disabled:opacity-50"
          >
            Подтвердить код
          </button>
        </form>
      )}

      {step === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Имя пользователя"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-2 bg-purple-500 text-white rounded disabled:opacity-50"
          >
            Зарегистрироваться
          </button>
        </form>
      )}
    </div>
  );
}

export default function LoginPage({ onLogin }) {
  return <AuthFlow onLogin={onLogin} />;
}