import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Persistence simulation for demo purposes
  useEffect(() => {
    const savedUser = localStorage.getItem('daily_pulse_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const newUser = {
      uid: Math.random().toString(36).substring(7),
      email,
      displayName: email.split('@')[0],
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    setUser(newUser);
    localStorage.setItem('daily_pulse_user', JSON.stringify(newUser));
    setLoading(false);
  };

  const signUp = async (email: string, pass: string) => {
    await signIn(email, pass);
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('daily_pulse_user');
  };

  const signInWithGoogle = async () => {
    await signIn('google-user@gmail.com', '');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
