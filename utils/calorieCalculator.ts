
import type { UserProfile } from '../types';
import { Sex, ActivityLevel, Goal } from '../types';

// Mifflin-St Jeor Equation for BMR
const calculateBMR = (profile: UserProfile): number => {
  const { weight, height, age, sex } = profile;
  if (sex === Sex.Male) {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

const activityMultipliers: Record<ActivityLevel, number> = {
  [ActivityLevel.Sedentary]: 1.2,
  [ActivityLevel.LightlyActive]: 1.375,
  [ActivityLevel.ModeratelyActive]: 1.55,
  [ActivityLevel.VeryActive]: 1.725,
  [ActivityLevel.SuperActive]: 1.9,
};

// Calculate Total Daily Energy Expenditure (TDEE)
export const calculateTDEE = (profile: UserProfile): number => {
  const bmr = calculateBMR(profile);
  const multiplier = activityMultipliers[profile.activityLevel];
  const maintenanceCalories = bmr * multiplier;

  switch (profile.goal) {
    case Goal.LoseWeight:
      return maintenanceCalories - 500; // 500 calorie deficit for weight loss
    case Goal.GainWeight:
      return maintenanceCalories + 500; // 500 calorie surplus for weight gain
    case Goal.MaintainWeight:
    default:
      return maintenanceCalories;
  }
};
