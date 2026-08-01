import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials } from '../types/auth';
import { authService } from '../services/auth.service';
import { setLogoutHandler } from '../services/api';
import { STORAGE_KEYS } from '../constants/storage';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isInitializing: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Sign-out error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLogoutHandler(signOut);
    restoreSession();
  }, [signOut]);

  const restoreSession = async () => {
    try {
      setIsInitializing(true);
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      
      if (!storedToken) {
        setIsInitializing(false);
        return;
      }

      // We have a token, let's validate it
      try {
        // This will use the token via the API interceptor which reads it from AsyncStorage
        const userData = await authService.me();
        
        // Validation succeeded
        setToken(storedToken);
        setUser(userData);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      } catch (error) {
        // Validation failed (e.g. 401), clean up
        console.error('Token validation failed:', error);
        await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
        await AsyncStorage.removeItem(STORAGE_KEYS.USER);
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const signIn = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      const { token: newToken, user: newUser } = response;

      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);
    } catch (error) {
      console.error('Sign-in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isInitializing,
        signIn,
        signOut,
        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
