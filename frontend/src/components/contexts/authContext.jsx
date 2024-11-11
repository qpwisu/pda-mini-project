import React, { createContext, useCallback, useEffect, useState } from 'react';

export const AuthContext = createContext();

const AUTH_KEY = 'AUTH_USER';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1번째 방법
    // const userStr = sessionStorage.getItem(AUTH_KEY);
    // if (userStr) {
    //   setUser(JSON.parse(userStr));
    // }

    // 2번째 방법
    checkLogin();
  }, []);

  const clientLogin = useCallback((user) => {
    setUser(user);
    // 1번째 방법
  }, []);

  const clientLogout = useCallback(() => {
    setUser(null);
    // 1번째 방법
    // sessionStorage.removeItem(AUTH_KEY);
  }, []);

  //

  const checkLogin = useCallback(async () => {
    // 2번째 방법
    const res = await fetch(`${API_BASE_URL}/api/users/me`);
    if (res.ok) {
      const user = res.json();
      setUser(user);
      return user;
    }
    setUser(null);
    return null;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        clientLogin,
        clientLogout,
        checkLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
