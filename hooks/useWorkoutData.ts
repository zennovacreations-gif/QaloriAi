
import { useState, useEffect, useCallback } from 'react';
import type { WorkoutData } from '../types';

interface LogWorkoutDetails {
  duration?: number;
  met?: number;
  weight?: number;
  manualCalories?: number;
}

const useWorkoutData = () => {
  const [workoutData, setWorkoutData] = useState<WorkoutData>(() => {
    try {
      const item = window.localStorage.getItem('workoutData');
      const today = new Date().toDateString();
      if (item) {
        const data: WorkoutData = JSON.parse(item);
        // Reset if it's a new day
        if (data.date !== today) {
          return { caloriesBurned: 0, date: today };
        }
        return data;
      }
    } catch (error) {
      console.error('Error reading workoutData from localStorage', error);
    }
    return { caloriesBurned: 0, date: new Date().toDateString() };
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('workoutData', JSON.stringify(workoutData));
    } catch (error) {
      console.error('Error saving workoutData to localStorage', error);
    }
  }, [workoutData]);

  const logWorkout = useCallback((details: LogWorkoutDetails) => {
    let caloriesBurnedThisSession = 0;
    
    if (details.manualCalories && details.manualCalories > 0) {
        caloriesBurnedThisSession = details.manualCalories;
    } else if (details.duration && details.met && details.weight) {
        // Formula: Calories/min = (MET * body weight in kg * 3.5) / 200
        caloriesBurnedThisSession = Math.round(((details.met * details.weight * 3.5) / 200) * details.duration);
    } else {
        return; // Not enough info to log
    }
    
    setWorkoutData(prev => {
        const today = new Date().toDateString();
        // Check again in case the day changed since the component loaded
        const currentCalories = prev.date === today ? prev.caloriesBurned : 0;
        return {
            caloriesBurned: currentCalories + caloriesBurnedThisSession,
            date: today,
        };
    });
  }, []);

  const resetWorkout = useCallback(() => {
    setWorkoutData({
        caloriesBurned: 0,
        date: new Date().toDateString(),
    });
  }, []);


  return { workoutData, logWorkout, resetWorkout };
};

export default useWorkoutData;
