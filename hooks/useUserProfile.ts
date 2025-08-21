
import { useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '../types';

const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const item = window.localStorage.getItem('userProfile');
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading userProfile from localStorage', error);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (userProfile) {
        window.localStorage.setItem('userProfile', JSON.stringify(userProfile));
      } else {
        window.localStorage.removeItem('userProfile');
      }
    } catch (error) {
      console.error('Error saving userProfile to localStorage', error);
    }
  }, [userProfile]);

  const clearUserProfile = useCallback(() => {
    setUserProfile(null);
  }, []);

  return { userProfile, setUserProfile, clearUserProfile };
};

export default useUserProfile;
