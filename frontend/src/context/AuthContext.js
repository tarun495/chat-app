import { createContext, useState, useContext } from 'react';

// Create context
const AuthContext = createContext();

// Provider — wraps whole app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (userData, token) => {
    // Make sure id is stored correctly
    const userToStore = {
      id: userData.id || userData._id,
      username: userData.username,
      email: userData.email
    };
    localStorage.setItem('user', JSON.stringify(userToStore));
    localStorage.setItem('token', token);
    setUser(userToStore);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth anywhere
export function useAuth() {
  return useContext(AuthContext);
}