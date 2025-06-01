
import { createContext, useState, useEffect, useContext } from 'react';
import { isParallel } from '../utils/settings';
import { generateHeaders, getUser } from '../utils/auth';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    let url = isParallel() 
      ? '/api/whoami' 
      : 'http://localhost:8000/api/whoami';
    fetch(url, {
        method: 'GET',
        headers: generateHeaders(getUser()),
    })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка запроса');
        return res.json();
      })
      .then(data => setUsername(data.user.username))
      .catch(err => {
        console.error('Ошибка получения username:', err);
        setUsername(null);
      });
  }, []);

  return (
    <UserContext.Provider value={{ username }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
