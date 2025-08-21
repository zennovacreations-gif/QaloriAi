
export enum Sex {
  Male = 'Male',
  Female = 'Female',
}

export enum ActivityLevel {
  Sedentary = 'Sedentary (little or no exercise)',
  LightlyActive = 'Lightly active (exercise 1-3 days/week)',
  ModeratelyActive = 'Moderately active (exercise 3-5 days/week)',
  VeryActive = 'Very active (exercise 6-7 days a week)',
  SuperActive = 'Super active (very hard exercise & physical job)',
}

export enum Goal {
  LoseWeight = 'Lose Weight',
  MaintainWeight = 'Maintain Weight',
  GainWeight = 'Gain Weight',
}

export interface UserProfile {
  age: number;
  weight: number; // in kg
  height: number; // in cm
  sex: Sex;
  activityLevel: ActivityLevel;
  goal: Goal;
  dietaryPreferences: string[];
  allergies: string;
}

export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  recipeName: string;
  calories: number;
  macros: Macros;
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
}

export interface DailyPlan {
  breakfast: Meal;
  morningSnack: Meal;
  lunch: Meal;
  afternoonSnack: Meal;
  dinner: Meal;
  eveningSnack: Meal;
  totalCalories: number;
  totalMacros: Macros;
}

export type MealType = 'breakfast' | 'morningSnack' | 'lunch' | 'afternoonSnack' | 'dinner' | 'eveningSnack';

export interface HydrationData {
    consumed: number; // in ml
    goal: number; // in ml
}

export interface WorkoutData {
  caloriesBurned: number;
  date: string; // YYYY-MM-DD
}