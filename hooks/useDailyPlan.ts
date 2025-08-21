
import { useState, useEffect, useCallback } from 'react';
import type { DailyPlan } from '../types';

const useDailyPlan = () => {
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(() => {
    try {
      const item = window.localStorage.getItem('dailyPlan');
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading dailyPlan from localStorage', error);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (dailyPlan) {
        window.localStorage.setItem('dailyPlan', JSON.stringify(dailyPlan));
      } else {
        window.localStorage.removeItem('dailyPlan');
      }
    } catch (error) {
      console.error('Error saving dailyPlan to localStorage', error);
    }
  }, [dailyPlan]);

  const clearDailyPlan = useCallback(() => {
    setDailyPlan(null);
  }, []);

  return { dailyPlan, setDailyPlan, clearDailyPlan };
};

export default useDailyPlan;
