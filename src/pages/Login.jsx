import React, { useState, useEffect } from 'react';
import { isParallel } from '../utils/settings';
import { check_if_email_registered, setUser } from '../utils/auth';
import { useNavigate } from "react-router-dom";

function AuthFlow({ onLogin }) {
  const [email, setEmail] = useState('');
  const [isRegistered, setIsRegistered] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();

  const checkEmail = async (e) => {
    e.preventDefault();
    setIsChecking(true);
    try {
      const registered = await check_if_email_registered(email);
      setIsRegistered(registered);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Ошибка проверки email');
      setIsRegistered(null);
    }
    setIsChecking(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (isRegistered !== null) {
      setIsRegistered(null);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const url = isParallel() ? "/api/login" : "http://localhost:8000/api/login";
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Неверные данные для входа');
      
      const data = await response.json();
      setUser(data.access_token);
      onLogin();
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || 'Ошибка входа');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Пароли не совпадают');
      return;
    }

    const url = isParallel() ? "/api/register" : "http://localhost:8000/api/register";
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      if (!response.ok) throw new Error('Ошибка регистрации');
      
      const data = await response.json();
      setUser(data.access_token);
      onLogin();
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || 'Ошибка регистрации');
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {/* Email форма всегда сверху */}
        <form onSubmit={checkEmail} className="mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                  required
                />
                <button 
                  type="submit" 
                  disabled={isChecking}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isChecking ? '...' : '→'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}

        {/* Форма логина */}
        {isRegistered === true && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Войти
            </button>
          </form>
        )}

        {/* Форма регистрации */}
        {isRegistered === false && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Имя пользователя</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Подтвердите пароль</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Зарегистрироваться
            </button>
          </form>
        )}
      </div>
    </div>
  );

}

export default function LoginPage({ onLogin }) {
  return <AuthFlow onLogin={onLogin} />;
}