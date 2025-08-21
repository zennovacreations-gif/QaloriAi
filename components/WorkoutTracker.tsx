
import React, { useState } from 'react';
import { DumbbellIcon } from './icons';
import { EXERCISE_OPTIONS } from '../constants';

interface WorkoutTrackerProps {
  caloriesBurned: number;
  onLogWorkout: (data: { duration?: number; met?: number; manualCalories?: number }) => void;
  onResetWorkout: () => void;
}

type ExerciseOption = typeof EXERCISE_OPTIONS[0];

const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({ caloriesBurned, onLogWorkout, onResetWorkout }) => {
  const [duration, setDuration] = useState('');
  const [manualCalories, setManualCalories] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseOption | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedExercise === null) {
      onResetWorkout();
      return;
    }

    const durationNum = parseInt(duration, 10);
    const manualCaloriesNum = parseInt(manualCalories, 10);

    if (manualCaloriesNum > 0) {
      onLogWorkout({ manualCalories: manualCaloriesNum });
    } else if (durationNum > 0 && selectedExercise) {
      onLogWorkout({ duration: durationNum, met: selectedExercise.met });
    }
    
    setDuration('');
    setManualCalories('');
    setSelectedExercise(null);
  };
  
  const isNoneSelected = selectedExercise === null;

  let canSubmit = false;
  let buttonText = "Log Workout";

  if (isNoneSelected) {
      canSubmit = true;
      buttonText = "Clear Logged Workouts";
  } else {
      const canSubmitAuto = duration && parseInt(duration, 10) > 0 && !!selectedExercise;
      const canSubmitManual = manualCalories && parseInt(manualCalories, 10) > 0;
      canSubmit = canSubmitAuto || canSubmitManual;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">Workout Tracker</h3>
        <DumbbellIcon className="w-6 h-6 text-orange-500" />
      </div>
      
      <div className="bg-orange-50 p-4 rounded-lg text-center mb-4">
        <p className="text-sm text-orange-700">Calories Burned Today</p>
        <p className="text-3xl font-bold text-orange-600">{caloriesBurned.toFixed(0)}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Select an Exercise</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {EXERCISE_OPTIONS.map((exercise) => {
              const isSelected = isNoneSelected ? exercise.name === 'None' : selectedExercise?.name === exercise.name;
              return (
                <button
                  type="button"
                  key={exercise.name}
                  onClick={() => {
                    if (exercise.name === 'None') {
                      setSelectedExercise(null);
                      setDuration('');
                      setManualCalories('');
                    } else {
                      setSelectedExercise(exercise);
                    }
                  }}
                  className={`flex flex-col items-center justify-center p-2 border rounded-lg text-center font-medium transition-all duration-200 aspect-square
                    ${isSelected 
                      ? 'bg-orange-50 border-orange-400 ring-2 ring-orange-300' 
                      : 'bg-white border-gray-200 hover:border-orange-300'}
                  `}
                >
                  <span className="text-2xl mb-1" role="img" aria-label={exercise.name}>{exercise.icon}</span>
                  <span className={`text-xs font-semibold ${isSelected ? 'text-orange-800' : 'text-gray-700'}`}>
                    {exercise.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        
        {selectedExercise && (
          <div className="animate-fade-in space-y-4">
            <div>
                <label htmlFor="duration" className="block text-sm font-bold text-gray-700">Duration (minutes)</label>
                <input 
                    type="number" 
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 30"
                    className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
            </div>

            <div className="flex items-center text-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm font-semibold">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            <div>
                <label htmlFor="manualCalories" className="block text-sm font-bold text-gray-700">Manually Enter Calories Burned</label>
                <input 
                    type="number" 
                    id="manualCalories"
                    value={manualCalories}
                    onChange={(e) => setManualCalories(e.target.value)}
                    placeholder="From your watch or app"
                    className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
            </div>
          </div>
        )}
      
        <button 
            type="submit"
            className="w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition disabled:bg-orange-300 disabled:cursor-not-allowed"
            disabled={!canSubmit}
        >
            {buttonText}
        </button>
      </form>
    </div>
  );
};

export default WorkoutTracker;
