'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  nickname?: string;
  profilePicture?: string;
  birthdate?: string;
  secondaryEmail?: string;
  phoneNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  onboardingCompleted: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from backend on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('walleto_token');
      if (token) {
        try {
          const userData = await api.getCurrentUser();
          setUser({
            id: userData.id,
            email: userData.email,
            firstName: userData.first_name,
            lastName: userData.last_name,
            username: userData.username || undefined,
            nickname: userData.nickname || undefined,
            profilePicture: userData.profile_picture || undefined,
            birthdate: userData.birthdate || undefined,
            secondaryEmail: userData.secondary_email || undefined,
            phoneNumber: userData.phone_number || undefined,
            street: userData.street || undefined,
            city: userData.city || undefined,
            state: userData.state || undefined,
            zipCode: userData.zip_code || undefined,
            country: userData.country || undefined,
            onboardingCompleted: userData.onboarding_completed,
          });
        } catch (error) {
          // Token is invalid/expired - silently remove it
          localStorage.removeItem('walleto_token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const signUp = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    const response = await api.signUp({
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
    });

    // Store token
    localStorage.setItem('walleto_token', response.access_token);

    // Fetch user data
    const userData = await api.getCurrentUser();
    setUser({
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      username: userData.username || undefined,
      nickname: userData.nickname || undefined,
      profilePicture: userData.profile_picture || undefined,
      birthdate: userData.birthdate || undefined,
      secondaryEmail: userData.secondary_email || undefined,
      phoneNumber: userData.phone_number || undefined,
      street: userData.street || undefined,
      city: userData.city || undefined,
      state: userData.state || undefined,
      zipCode: userData.zip_code || undefined,
      country: userData.country || undefined,
      onboardingCompleted: userData.onboarding_completed,
    });
  };

  const signIn = async (email: string, password: string) => {
    const response = await api.signIn({ email, password });

    // Store token
    localStorage.setItem('walleto_token', response.access_token);

    // Fetch user data
    const userData = await api.getCurrentUser();
    setUser({
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      username: userData.username || undefined,
      nickname: userData.nickname || undefined,
      profilePicture: userData.profile_picture || undefined,
      birthdate: userData.birthdate || undefined,
      secondaryEmail: userData.secondary_email || undefined,
      phoneNumber: userData.phone_number || undefined,
      street: userData.street || undefined,
      city: userData.city || undefined,
      state: userData.state || undefined,
      zipCode: userData.zip_code || undefined,
      country: userData.country || undefined,
      onboardingCompleted: userData.onboarding_completed,
    });
  };

  const signInWithGoogle = async () => {
    // TODO: Implement Google OAuth
    throw new Error('Google sign-in not implemented yet');
  };

  const signOut = () => {
    localStorage.removeItem('walleto_token');
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('walleto_token');
    if (token) {
      try {
        const userData = await api.getCurrentUser();
        setUser({
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          username: userData.username || undefined,
          nickname: userData.nickname || undefined,
          profilePicture: userData.profile_picture || undefined,
          birthdate: userData.birthdate || undefined,
          secondaryEmail: userData.secondary_email || undefined,
          phoneNumber: userData.phone_number || undefined,
          street: userData.street || undefined,
          city: userData.city || undefined,
          state: userData.state || undefined,
          zipCode: userData.zip_code || undefined,
          country: userData.country || undefined,
          onboardingCompleted: userData.onboarding_completed,
        });
      } catch (error) {
        // Token is invalid/expired - silently remove it
        localStorage.removeItem('walleto_token');
        setUser(null);
      }
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    const updateData: {
      username?: string;
      nickname?: string;
      profile_picture?: string;
      birthdate?: string;
      secondary_email?: string;
      phone_number?: string;
      street?: string;
      city?: string;
      state?: string;
      zip_code?: string;
      country?: string;
      onboarding_completed?: boolean;
    } = {};

    if (data.username !== undefined) updateData.username = data.username;
    if (data.nickname !== undefined) updateData.nickname = data.nickname;
    if (data.profilePicture !== undefined) updateData.profile_picture = data.profilePicture;
    if (data.birthdate !== undefined) updateData.birthdate = data.birthdate;
    if (data.secondaryEmail !== undefined) updateData.secondary_email = data.secondaryEmail;
    if (data.phoneNumber !== undefined) updateData.phone_number = data.phoneNumber;
    if (data.street !== undefined) updateData.street = data.street;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.zipCode !== undefined) updateData.zip_code = data.zipCode;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.onboardingCompleted !== undefined) updateData.onboarding_completed = data.onboardingCompleted;

    const userData = await api.updateProfile(updateData);

    setUser({
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      username: userData.username || undefined,
      nickname: userData.nickname || undefined,
      profilePicture: userData.profile_picture || undefined,
      birthdate: userData.birthdate || undefined,
      secondaryEmail: userData.secondary_email || undefined,
      phoneNumber: userData.phone_number || undefined,
      street: userData.street || undefined,
      city: userData.city || undefined,
      state: userData.state || undefined,
      zipCode: userData.zip_code || undefined,
      country: userData.country || undefined,
      onboardingCompleted: userData.onboarding_completed,
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, signOut, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
