import { ActivityLevel, Goal, Sex } from './types';

export const SEX_OPTIONS = Object.values(Sex);
export const ACTIVITY_LEVEL_OPTIONS = Object.values(ActivityLevel);
export const GOAL_OPTIONS = Object.values(Goal);

export const DIETARY_PREFERENCE_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Non-vegetarian',
  'Halal',
  'Kosher',
  'Gluten-Free',
  'Dairy-Free',
  'Low-Carb',
  'Pescatarian'
];

export const LOADING_QUOTES = [
  "The first wealth is health.",
  "To keep the body in good health is a duty.",
  "Let food be thy medicine and medicine be thy food.",
  "A healthy outside starts from the inside.",
  "Take care of your body. It's the only place you have to live.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Cooking up your perfect day...",
  "Gathering the freshest ideas for you...",
];

export const EXERCISE_OPTIONS = [
  { name: 'None', met: 0, icon: '🚫' },
  { name: 'Walking', met: 3.5, icon: '🚶‍♂️' },
  { name: 'Running', met: 9.8, icon: '🏃‍♂️' },
  { name: 'Cycling', met: 7.5, icon: '🚲' },
  { name: 'Swimming', met: 8.0, icon: '🏊‍♂️' },
  { name: 'Strength Training', met: 5.0, icon: '💪' },
  { name: 'Yoga', met: 2.5, icon: '🧘‍♂️' },
  { name: 'Dance', met: 5.0, icon: '🕺' },
  { name: 'Hiking', met: 6.0, icon: '🥾' },
  { name: 'Basketball', met: 6.5, icon: '🏀' },
  { name: 'Soccer', met: 7.0, icon: '⚽️' },
  { name: 'Volleyball', met: 4.0, icon: '🏐' },
  { name: 'Tennis', met: 7.3, icon: '🎾' },
  { name: 'Other', met: 4.0, icon: '🏹' },
];