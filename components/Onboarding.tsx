
import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { Sex, ActivityLevel, Goal } from '../types';
import { SEX_OPTIONS, ACTIVITY_LEVEL_OPTIONS, GOAL_OPTIONS, DIETARY_PREFERENCE_OPTIONS } from '../constants';
import { UserIcon, ChartBarIcon } from './icons';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    age: 25,
    weight: 70,
    height: 175,
    sex: Sex.Male,
    activityLevel: ActivityLevel.ModeratelyActive,
    goal: Goal.MaintainWeight,
    dietaryPreferences: [],
    allergies: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: name === 'age' || name === 'weight' || name === 'height' ? Number(value) : value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setProfile(prev => {
      const prefs = prev.dietaryPreferences;
      if (checked) {
        return { ...prev, dietaryPreferences: [...prefs, value] };
      } else {
        return { ...prev, dietaryPreferences: prefs.filter(p => p !== value) };
      }
    });
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(profile);
  };

  const isStep1Valid = profile.age > 0 && profile.weight > 0 && profile.height > 0 && profile.dietaryPreferences.length > 0;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center text-gray-700 flex items-center justify-center"><UserIcon className="w-6 h-6 mr-2" /> About You</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="age" className="block text-sm font-bold text-gray-700">Age</label>
                <input type="number" name="age" id="age" value={profile.age} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" required />
              </div>
              <div>
                <label htmlFor="sex" className="block text-sm font-bold text-gray-700">Sex</label>
                <select name="sex" id="sex" value={profile.sex} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                  {SEX_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-bold text-gray-700">Weight (kg)</label>
                <input type="number" name="weight" id="weight" value={profile.weight} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" required />
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-bold text-gray-700">Height (cm)</label>
                <input type="number" name="height" id="height" value={profile.height} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" required />
              </div>
            </div>
             <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Dietary Preferences</label>
              <p className="text-sm text-gray-500 mb-4">Select at least one option. This helps us tailor your meal plan.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {DIETARY_PREFERENCE_OPTIONS.map(option => {
                  const isSelected = profile.dietaryPreferences.includes(option);
                  return (
                    <label key={option} 
                      className={`
                        cursor-pointer p-3 border rounded-lg text-center font-medium transition-all duration-200
                        ${isSelected 
                          ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300' 
                          : 'bg-white border-gray-200 hover:border-emerald-300'}
                      `}
                    >
                      <input 
                        type="checkbox" 
                        name="dietaryPreferences" 
                        value={option} 
                        checked={isSelected} 
                        onChange={handleCheckboxChange} 
                        className="sr-only"
                      />
                      <span className={`text-sm ${isSelected ? 'text-emerald-800' : 'text-gray-700'}`}>
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div>
              <label htmlFor="allergies" className="block text-sm font-bold text-gray-700">Allergies (comma-separated)</label>
              <input type="text" name="allergies" id="allergies" value={profile.allergies} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" placeholder="e.g., peanuts, shellfish, dairy" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
             <h3 className="text-xl font-semibold text-center text-gray-700 flex items-center justify-center"><ChartBarIcon className="w-6 h-6 mr-2" /> Lifestyle & Goals</h3>
            <div>
              <label htmlFor="activityLevel" className="block text-sm font-bold text-gray-700">Activity Level</label>
              <select name="activityLevel" id="activityLevel" value={profile.activityLevel} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                {ACTIVITY_LEVEL_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="goal" className="block text-sm font-bold text-gray-700">Your Goal</label>
              <select name="goal" id="goal" value={profile.goal} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                {GOAL_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const progress = (step / 2) * 100;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome to QaloriAI</h2>
      <p className="text-center text-gray-500 mb-8">Let's personalize your daily meal plan.</p>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {renderStep()}
        <div className="flex justify-between items-end mt-8">
          {step > 1 ? (
            <button type="button" onClick={prevStep} className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">
              Back
            </button>
          ) : <div></div>}
          {step < 2 ? (
            <div className="text-right">
              <button 
                type="button" 
                onClick={nextStep} 
                className="px-6 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition disabled:bg-emerald-300 disabled:cursor-not-allowed"
                disabled={!isStep1Valid}
              >
                Next
              </button>
              {!isStep1Valid && <p className="text-xs text-red-500 mt-1">Please fill all fields and select a preference.</p>}
            </div>
          ) : (
            <button type="submit" className="px-6 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition">
              Generate My Plan
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Onboarding;