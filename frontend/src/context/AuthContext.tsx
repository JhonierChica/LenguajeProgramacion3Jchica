import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, LoginRequest, AuthResponse } from '../types';
import { api } from '../lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });
  const [isLoading] = useState(false);

  useEffect(() => {
    // Escuchar el evento global de logout emitido por api.ts en caso de 401/403
    const handleGlobalLogout = () => {
      setUser(null);
      setToken(null);
      toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    };

    window.addEventListener('auth-logout', handleGlobalLogout);
    return () => window.removeEventListener('auth-logout', handleGlobalLogout);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        username: response.username,
        fullName: response.fullName,
        role: response.role
      }));

      setToken(response.token);
      setUser({
        username: response.username,
        fullName: response.fullName,
        role: response.role
      });

      toast.success(`¡Bienvenido, ${response.fullName}!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión. Verifica tus credenciales.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Sesión cerrada correctamente.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
