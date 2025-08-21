
import React, { useState } from 'react';
import type { Meal, MealType } from '../types';
import RecipeModal from './RecipeModal';
import { FireIcon, RefreshIcon, CheckCircleIcon, BookOpenIcon, ShoppingCartIcon } from './icons';
import Spinner from './Spinner';

interface MealCardProps {
  mealType: MealType;
  meal: Meal;
  isLogged: boolean;
  onLogToggle: (mealType: MealType) => void;
  onSwap: (mealType: MealType) => void;
  isSwapping: boolean;
}

const MealCard: React.FC<MealCardProps> = ({ mealType, meal, isLogged, onLogToggle, onSwap, isSwapping }) => {
  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const mealTypeTitles: Record<MealType, string> = {
    breakfast: 'Breakfast',
    morningSnack: 'Morning Snack',
    lunch: 'Lunch',
    afternoonSnack: 'Afternoon Snack',
    dinner: 'Dinner',
    eveningSnack: 'Evening Snack',
  };

  const handleSwap = () => {
    if (!isSwapping) {
      onSwap(mealType);
    }
  };

  if (!meal) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
            <p>Meal data not available.</p>
        </div>
    );
  }

  return (
    <>
      <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 flex flex-col ${isLogged ? 'ring-2 ring-emerald-500' : ''}`}>
        {meal.imageUrl ? (
          <img className="h-48 w-full object-cover" src={meal.imageUrl} alt={meal.recipeName} />
        ) : (
          <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
             <Spinner />
          </div>
        )}
        <div className="p-6 flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">{mealTypeTitles[mealType]}</p>
              <h3 className="mt-1 text-xl leading-tight font-bold text-gray-900">{meal.recipeName}</h3>
            </div>
            <button onClick={() => onLogToggle(mealType)} className={`p-2 rounded-full transition ${isLogged ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              <CheckCircleIcon className="w-6 h-6"/>
            </button>
          </div>
          
          <div className="mt-4 flex items-center text-gray-600">
            <FireIcon className="w-5 h-5 text-red-500" />
            <span className="ml-2 font-medium">{meal.calories} kcal</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-center">
            <div className="bg-blue-50 p-2 rounded-lg">
                <p className="font-bold text-blue-800">{meal.macros.protein}g</p>
                <p className="text-blue-600">Protein</p>
            </div>
            <div className="bg-yellow-50 p-2 rounded-lg">
                <p className="font-bold text-yellow-800">{meal.macros.carbs}g</p>
                <p className="text-yellow-600">Carbs</p>
            </div>
            <div className="bg-pink-50 p-2 rounded-lg">
                <p className="font-bold text-pink-800">{meal.macros.fat}g</p>
                <p className="text-pink-600">Fat</p>
            </div>
          </div>
        </div>
        
        <div className="px-6 pb-4 grid grid-cols-3 gap-2 text-sm mt-auto">
          <button onClick={() => setIsRecipeOpen(true)} className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition">
            <BookOpenIcon className="w-4 h-4 mr-2" /> Recipe
          </button>
          <button onClick={handleSwap} disabled={isSwapping} className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {isSwapping ? <Spinner /> : <><RefreshIcon className="w-4 h-4 mr-2" /> Swap</>}
          </button>
           <button onClick={() => setIsBuyModalOpen(true)} className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition">
            <ShoppingCartIcon className="w-4 h-4 mr-2" /> Buy
          </button>
        </div>
      </div>
      
      {isRecipeOpen && <RecipeModal meal={meal} onClose={() => setIsRecipeOpen(false)} />}
      
      {isBuyModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
                <h3 className="text-xl font-bold mb-4">Buy Ingredients or Meal</h3>
                <p className="text-gray-600 mb-6">You can find the ingredients for '{meal.recipeName}' at your local grocery store, or search for it at nearby restaurants!</p>
                <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meal.recipeName)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition mb-2"
                >
                    Search on Google Maps
                </a>
                <button onClick={() => setIsBuyModalOpen(false)} className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">
                    Close
                </button>
            </div>
        </div>
      )}
    </>
  );
};

export default MealCard;
