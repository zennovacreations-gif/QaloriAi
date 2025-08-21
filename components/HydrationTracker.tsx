
import React from 'react';
import { WaterDropIcon } from './icons';
import type { HydrationData } from '../types';

interface HydrationTrackerProps {
  data: HydrationData;
  onAddWater: (amount: number) => void;
}

const HydrationTracker: React.FC<HydrationTrackerProps> = ({ data, onAddWater }) => {
  const { consumed, goal } = data;
  const percentage = goal > 0 ? (consumed / goal) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">Hydration</h3>
        <WaterDropIcon className="w-6 h-6 text-blue-500" />
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
          className="bg-gradient-to-r from-blue-400 to-cyan-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm font-medium text-gray-600 mb-4">
        <span>{consumed} ml</span>
        <span>{goal} ml</span>
      </div>
      <div className="flex justify-center gap-2 flex-wrap">
        <button
          onClick={() => onAddWater(-250)}
          className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-200 transition"
        >
          -1 Glass
        </button>
        <button
          onClick={() => onAddWater(250)}
          className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg hover:bg-blue-200 transition"
        >
          +1 Glass
        </button>
        <button
          onClick={() => onAddWater(500)}
          className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg hover:bg-blue-200 transition"
        >
          +1 Bottle
        </button>
      </div>
    </div>
  );
};

export default HydrationTracker;
