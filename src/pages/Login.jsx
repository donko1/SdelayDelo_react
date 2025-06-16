import React, { useState } from 'react';
import { isParallel } from '../utils/settings';
import { check_if_email_registered, setUser, generateHeaders } from '../utils/auth';
import { toHtml } from '@fortawesome/fontawesome-svg-core';
import { getUserLocaleInfo } from '../utils/locale';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';


function AuthFlow() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');
  const [step, setStep] = useState('email');
  const [identifier, setIdentifier] = useState('');
  const isEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [secretEmail, setSecretEmail] = useState("")
  const navigate = useNavigate();
  const { refreshUser } = useUser();

  const fetchEmailByUsername = async (username) => {
    const baseUrl = isParallel() ? "/api/get_email_by_username" : "http://localhost:8000/api/get_email_by_username";
    const url = new URL(baseUrl, window.location.origin);
    url.searchParams.append("username", username);

    const response = await fetch(url.toString(), {
      method: "GET",
    });

    if (!response.ok) throw new Error('Пользователь не найден');
    const data = await response.json();
    return data.email;
  };



  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let resolvedEmail = '';
      if (isEmail(identifier)) {
        resolvedEmail = identifier;
      } else {
        resolvedEmail = await fetchEmailByUsername(identifier);
      }

      setEmail(resolvedEmail); 
      const isRegistered = await check_if_email_registered(resolvedEmail);

      if (isRegistered) {
        setStep('login');
      } else {
        await sendVerificationCode(resolvedEmail);
        setStep('send_code');
      }

      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  const sendVerificationCode = async (targetEmail) => {
    const url = isParallel() ? "/api/send_code/" : "http://localhost:8000/api/send_code/";
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: targetEmail })
    });
    if (!response.ok) throw new Error('Ошибка отправки кода');
  };


  const handleFA2Submit = async (e) => {
    let tkn;
    e.preventDefault()
    setError('');
    setIsLoading(true)
    try {
      const url = isParallel() ? "/api/check_code/" : "http://localhost:8000/api/check_code/";
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      if(!response.ok) throw new Error('Неверный код');
      
      const data = await response.json();
      tkn = data.token
      setError('');
    } catch(err) {
      setError(err.message);
      setIsLoading(false)
      return;
    } 
      
        try {
          const url = isParallel() ? "/api/login" : "http://localhost:8000/api/login";
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, token: tkn })
          });
    
          if(!response.ok) throw new Error('Неверные данные');
          
          const data = await response.json();
          setUser(data.access_token);
          refreshUser();
          navigate("/");}
          catch(err) {
            setError(err.message);
            setIsLoading(false)
            return;
          }  
      finally {
      setIsLoading(false);}
    }
  
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

  const handleChangePassword = async (e) => {
    let tkn
    e.preventDefault()
    setIsLoading(true)
    try {
      const url = isParallel() ? "/api/check_code/" : "http://localhost:8000/api/check_code/";
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      if(!response.ok) throw new Error('Неверный код');
      
      const data = await response.json();
      tkn = data.token
      setError('');
    } catch(err) {
      setError(err.message);
      setIsLoading(false)
      return;
    } 

    try {
      const url = isParallel() ? "api/reset_password" : "http://localhost:8000/api/reset_password"
      const response = await fetch(url, {
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tkn, new_password:password })
      })
      if(!response.ok) throw new Error('Пароль слишком простой');
    }catch(err) {
      setError(err.message);
      setIsLoading(false)
      return;
    } 
    setStep("")
    setIsLoading(false)
    
  }
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
      console.log(response.status)
      const data = await response.json();
      if (response.status === 202) {
        setError('');
        setIsLoading(false)
        setSecretEmail(data.email)
        setStep("FA2")
        return;
      }
      setUser(data.access_token);
      refreshUser()
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
      let url = isParallel() ? "/api/register/" : "http://localhost:8000/api/register/";
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

      const data = await response.json();

      if(!response.ok) {
        switch (data.detail){ 
        case "password_8_symbols":
          throw new Error("В пароле должно быть минимум 8 символов")
        case "username_isnt_uniq":
          throw new Error("Придумайте уникальный username")
        }
  
        throw new Error('Ошибка регистрации')
      };
      
      try {

        url = isParallel() ? "api/change-userinfo/" : "http://localhost:8000/api/change-userinfo/";
        const { language, timeZone }  = getUserLocaleInfo(); 
        const response = await fetch(url, {
          method: "PATCH",
          headers: generateHeaders(data.access_token),
          body: JSON.stringify({
            "language":language,
            "timezone":timeZone
          })
        })
      }
      catch(err) {
        console.log(err)
        setError(err.message);
      } finally {
        setIsLoading(false);
        setUser(data.access_token);
        onLogin();
        navigate("/");
      }

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
            type="text"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (step !== 'email') setStep('email');
            }}
            placeholder="Email или username"
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
      {step === "FA2" &&(
        <div className='p-2 text-yellow-600 bg-red-100 rounded'>Для входа введите код, отправленный на {secretEmail}</div>
      )}
      
      {(step === 'login' || step === "FA2") && (
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="w-full p-2 border rounded"
            required
          />
          {step === "login" && (<>
            <button
            type="submit"
            disabled={isLoading}
            className="w-full p-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            Войти
          </button>
          <button
            onClick={() => {
              setStep("change_password")
              if (!email) {
                setEmail(fetchEmailByUsername(username))
              }
              sendVerificationCode(email)
            }}
            disabled={isLoading}
            className="w-full p-2 bg-yellow-500 text-white rounded disabled:opacity-50"
          >
            Сбросить пароль
          </button></>
          )}
          
        </form>
      )}

      {step === "change_password" && (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Код из письма"
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Новый пароль"
                  className="w-full p-2 border rounded"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full p-2 bg-purple-500 text-white rounded disabled:opacity-50"
                >
                  Сбросить пароль
                </button>

              </form>

      )}

      {step === "FA2" && (
                <form onSubmit={handleFA2Submit} className="space-y-4">
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

export default function LoginPage() {
  return <AuthFlow />;
}