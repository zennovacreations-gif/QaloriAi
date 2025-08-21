
import React from 'react';

interface LoadingProgressProps {
  percentage: number;
  message: string;
}

const LoadingProgress: React.FC<LoadingProgressProps> = ({ percentage, message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Generating your personalized meal plan</h2>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div
          className="bg-gradient-to-r from-emerald-400 to-teal-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-gray-500 text-center h-6 transition-opacity duration-300">{message}</p>
    </div>
  );
};

export default LoadingProgress;
