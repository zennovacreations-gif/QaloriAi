
import { useState, useEffect, useCallback } from 'react';
import type { HydrationData } from '../types';

const useHydrationData = () => {
  const [hydrationData, setHydrationData] = useState<HydrationData>(() => {
    try {
      const item = window.localStorage.getItem('hydrationData');
      return item ? JSON.parse(item) : { consumed: 0, goal: 2500 }; // Default goal 2.5L
    } catch (error) {
      console.error('Error reading hydrationData from localStorage', error);
      return { consumed: 0, goal: 2500 };
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('hydrationData', JSON.stringify(hydrationData));
    } catch (error) {
      console.error('Error saving hydrationData to localStorage', error);
    }
  }, [hydrationData]);

  const addWater = useCallback((amount: number) => {
    setHydrationData(prev => ({ 
      ...prev, 
      consumed: Math.max(0, prev.consumed + amount) 
    }));
  }, []);

  const resetHydration = useCallback(() => {
    setHydrationData(prev => ({ ...prev, consumed: 0 }));
  }, []);

  return { hydrationData, addWater, resetHydration, setHydrationData };
};

export default useHydrationData;
