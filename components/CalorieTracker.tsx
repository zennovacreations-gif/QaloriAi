import React from 'react';
import { CheckCircleIcon } from './icons';

interface CalorieTrackerProps {
  targetCalories: number;
  consumedCalories: number;
  burnedCalories: number;
}

const CalorieTracker: React.FC<CalorieTrackerProps> = ({ targetCalories, consumedCalories, burnedCalories }) => {
  const netTarget = targetCalories + burnedCalories;
  const percentage = netTarget > 0 ? (consumedCalories / netTarget) * 100 : 0;
  const remainingCalories = netTarget - consumedCalories;
  const goalReached = remainingCalories <= 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Calorie Tracker</h3>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
          className="bg-gradient-to-r from-emerald-400 to-teal-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm font-medium text-gray-600">
        <span>Consumed: {consumedCalories.toFixed(0)} kcal</span>
        <span>Target: {netTarget.toFixed(0)} kcal</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-100 p-3 rounded-lg">
          <p className="text-lg font-bold text-gray-800">{consumedCalories.toFixed(0)}</p>
          <p className="text-sm text-gray-500">Consumed</p>
        </div>
        {goalReached ? (
          <div className="bg-emerald-100 p-3 rounded-lg flex flex-col items-center justify-center text-center">
             <CheckCircleIcon className="w-8 h-8 text-emerald-600 mb-1" />
            <p className="text-lg font-bold text-emerald-600">Goal Reached!</p>
          </div>
        ) : (
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-lg font-bold text-gray-800">{remainingCalories.toFixed(0)}</p>
            <p className="text-sm text-gray-500">Remaining</p>
          </div>
        )}
        <div className="bg-gray-100 p-3 rounded-lg">
          <p className="text-lg font-bold text-red-600">{burnedCalories.toFixed(0)}</p>
          <p className="text-sm text-gray-500">Burned</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg">
          <p className="text-lg font-bold text-gray-800">{netTarget.toFixed(0)}</p>
          <p className="text-sm text-gray-500">Net Target</p>
        </div>
      </div>
    </div>
  );
};

export default CalorieTracker;