
import React from 'react';
import type { Meal } from '../types';
import { XIcon } from './icons';

interface RecipeModalProps {
  meal: Meal;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ meal, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{meal.recipeName}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition">
            <XIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Ingredients</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {meal.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Instructions</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              {meal.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
