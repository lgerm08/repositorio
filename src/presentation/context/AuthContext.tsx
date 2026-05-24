import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../../core/entities/User';
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl';
import { GetSessionUseCase } from '../../domain/usecases/auth/GetSessionUseCase';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const authRepo = new AuthRepositoryImpl();
const getSessionUseCase = new GetSessionUseCase(authRepo);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSessionUseCase.execute().then((u) => {
      if (u) {
        setUser(u);
        setToken(authRepo.getToken());
      }
    }).finally(() => setIsLoading(false));
  }, []);

  const setAuth = (t: string, u: User) => {
    authRepo.saveToken(t);
    setToken(t);
    setUser(u);
  };

  const clearAuth = () => {
    authRepo.clearToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, isAuthenticated: !!user, setAuth, clearAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
}
