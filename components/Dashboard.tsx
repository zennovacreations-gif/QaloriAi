
import React, { useState, useMemo } from 'react';
import type { DailyPlan, Meal, MealType, UserProfile } from '../types';
import MealCard from './MealCard';
import CalorieTracker from './CalorieTracker';
import HydrationTracker from './HydrationTracker';
import WorkoutTracker from './WorkoutTracker';
import { generateMealSwap, generateMealImage } from '../services/geminiService';
import { calculateTDEE } from '../utils/calorieCalculator';
import useHydrationData from '../hooks/useHydrationData';
import useWorkoutData from '../hooks/useWorkoutData';

interface DashboardProps {
  userProfile: UserProfile;
  dailyPlan: DailyPlan | null;
  regeneratePlan: () => void;
  onMealSwap: (updatedPlan: DailyPlan) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile, dailyPlan, regeneratePlan, onMealSwap }) => {
  const [loggedMeals, setLoggedMeals] = useState<Record<MealType, boolean>>({
    breakfast: false,
    morningSnack: false,
    lunch: false,
    afternoonSnack: false,
    dinner: false,
    eveningSnack: false,
  });
  const [swappingMeal, setSwappingMeal] = useState<MealType | null>(null);
  const { hydrationData, addWater } = useHydrationData();
  const { workoutData, logWorkout, resetWorkout } = useWorkoutData();

  const toggleMealLog = (mealType: MealType) => {
    setLoggedMeals(prev => ({ ...prev, [mealType]: !prev[mealType] }));
  };

  const handleSwapMeal = async (mealType: MealType) => {
    if (!dailyPlan) return;
    setSwappingMeal(mealType);
    try {
      const tdee = calculateTDEE(userProfile);
      
      // Step 1: Get new meal data (fast, text only)
      const newMealData = await generateMealSwap(userProfile, tdee, mealType, dailyPlan);
      
      // Create a temporary meal object for the optimistic update
      const tempMeal = { ...newMealData, imageUrl: undefined };
      let updatedPlan = { ...dailyPlan, [mealType]: tempMeal };

      // Recalculate totals
      const meals: Meal[] = Object.values(updatedPlan).filter(m => typeof m === 'object' && m !== null && 'recipeName' in m) as Meal[];
      updatedPlan.totalCalories = meals.reduce((sum, m) => sum + (m?.calories || 0), 0);
      updatedPlan.totalMacros = {
        protein: meals.reduce((sum, m) => sum + (m?.macros.protein || 0), 0),
        carbs: meals.reduce((sum, m) => sum + (m?.macros.carbs || 0), 0),
        fat: meals.reduce((sum, m) => sum + (m?.macros.fat || 0), 0),
      };
      
      // Step 2: Optimistically update UI with text content
      onMealSwap(updatedPlan);

      // Step 3: Generate and update image in the background
      const imageUrl = await generateMealImage(newMealData.recipeName);
      const finalMeal = { ...newMealData, imageUrl };
      const finalPlan = { ...updatedPlan, [mealType]: finalMeal };
      
      onMealSwap(finalPlan);

    } catch (error) {
      console.error("Failed to swap meal:", error);
      alert("Sorry, we couldn't swap the meal right now. Please try again.");
    } finally {
      setSwappingMeal(null);
    }
  };

  const loggedCalories = useMemo(() => {
    if (!dailyPlan) return 0;
    return (Object.keys(loggedMeals) as MealType[]).reduce((total, mealType) => {
      if (loggedMeals[mealType]) {
        return total + (dailyPlan[mealType]?.calories || 0);
      }
      return total;
    }, 0);
  }, [loggedMeals, dailyPlan]);

  if (!dailyPlan) {
    return (
      <div className="text-center">
        <p className="text-lg text-gray-600 mb-4">No meal plan found for today.</p>
        <button onClick={regeneratePlan} className="px-6 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition">
          Generate Today's Plan
        </button>
      </div>
    );
  }

  const tdee = calculateTDEE(userProfile);
  const mealTypes: MealType[] = ['breakfast', 'morningSnack', 'lunch', 'afternoonSnack', 'dinner', 'eveningSnack'];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Your Daily Plan</h2>
          <button
            onClick={regeneratePlan}
            className="px-6 py-2 bg-white border border-emerald-500 text-emerald-500 font-semibold rounded-lg hover:bg-emerald-50 transition flex items-center justify-center"
          >
            Generate New Plan
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CalorieTracker
              targetCalories={tdee}
              consumedCalories={loggedCalories}
              burnedCalories={workoutData.caloriesBurned}
            />
            <HydrationTracker data={hydrationData} onAddWater={addWater} />
            <WorkoutTracker 
              caloriesBurned={workoutData.caloriesBurned}
              onLogWorkout={(data) => logWorkout({ ...data, weight: userProfile.weight })}
              onResetWorkout={resetWorkout}
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mealTypes.map((mealType) => (
            dailyPlan[mealType] ? (
              <MealCard
                key={mealType}
                mealType={mealType}
                meal={dailyPlan[mealType]}
                isLogged={loggedMeals[mealType]}
                onLogToggle={toggleMealLog}
                onSwap={handleSwapMeal}
                isSwapping={swappingMeal === mealType}
              />
            ) : null
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
