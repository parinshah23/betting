'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { User } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get<User>('/auth/me');
      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          user: response.data as User,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      }));
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await api.post<{ user: User; tokens: { accessToken: string; refreshToken: string } }>('/auth/login', credentials);
      if (response.success && response.data) {
        api.setAccessToken(response.data.tokens.accessToken);
        api.setRefreshToken(response.data.tokens.refreshToken);
        setState({
          user: response.data.user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.error?.message || 'Login failed',
        }));
        return false;
      }
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'An error occurred during login',
      }));
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      // Map frontend camelCase to backend snake_case
      const payload = {
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
      };

      // Register returns just user data, no tokens (user needs to login after registration)
      const response = await api.post<{ id: string; email: string; first_name: string; last_name: string; role: string }>('/auth/register', payload);
      if (response.success && response.data) {
        // Auto-login after successful registration
        return await login({ email: data.email, password: data.password });
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.error?.message || 'Registration failed',
        }));
        return false;
      }
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'An error occurred during registration',
      }));
      return false;
    }
  };

  const logout = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await api.post('/auth/logout', {});
    } catch {
      // Ignore logout errors
    } finally {
      api.clearTokens();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    setState((prev) => ({ ...prev, error: null }));
    try {
      const response = await api.put<User>('/users/profile', data);
      if (response.success && response.data) {
        setState((prev) => ({ ...prev, user: response.data as User }));
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          error: response.error?.message || 'Profile update failed',
        }));
        return false;
      }
    } catch {
      setState((prev) => ({
        ...prev,
        error: 'An error occurred while updating profile',
      }));
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, error: null }));
    try {
      const response = await api.put('/users/password', { currentPassword, newPassword });
      if (response.success) {
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          error: response.error?.message || 'Password change failed',
        }));
        return false;
      }
    } catch {
      setState((prev) => ({
        ...prev,
        error: 'An error occurred while changing password',
      }));
      return false;
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
