
import React, { useState, useCallback } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import useUserProfile from './hooks/useUserProfile';
import useDailyPlan from './hooks/useDailyPlan';
import { generateMealPlan } from './services/geminiService';
import type { DailyPlan, UserProfile } from './types';
import { calculateTDEE } from './utils/calorieCalculator';
import Chatbot from './components/Chatbot';
import LoadingProgress from './components/LoadingProgress';

const ChatbotFab: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 bg-emerald-500 text-white w-16 h-16 rounded-full shadow-lg hover:bg-emerald-600 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 z-40 flex items-center justify-center"
    aria-label="Open nutrition chatbot"
  >
    <span className="text-3xl" role="img" aria-label="chef emoji">👨‍🍳</span>
  </button>
);


const App: React.FC = () => {
  const { userProfile, setUserProfile, clearUserProfile } = useUserProfile();
  const { dailyPlan, setDailyPlan, clearDailyPlan } = useDailyPlan();
  const [progress, setProgress] = useState<{ percentage: number; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleOnboardingComplete = useCallback(async (profile: UserProfile) => {
    setUserProfile(profile);
    setProgress({ percentage: 0, message: 'Getting ready...' });
    setError(null);
    try {
      const tdee = calculateTDEE(profile);
      const onProgressUpdate = (update: { percentage: number; message: string }) => {
        setProgress(update);
      };
      const plan = await generateMealPlan(profile, tdee, onProgressUpdate);
      setDailyPlan(plan);
    } catch (err) {
      setError('Failed to generate meal plan. Please check your API key and try again.');
      console.error(err);
    } finally {
      setProgress(null);
    }
  }, [setUserProfile, setDailyPlan]);

  const handleReset = () => {
    clearUserProfile();
    clearDailyPlan();
    // Also clear hydration & workout data
    window.localStorage.removeItem('hydrationData');
    window.localStorage.removeItem('workoutData');
  };

  const regeneratePlan = useCallback(async () => {
    if (!userProfile) return;
    setProgress({ percentage: 0, message: 'Getting ready...' });
    setError(null);
    try {
      const tdee = calculateTDEE(userProfile);
       const onProgressUpdate = (update: { percentage: number; message: string }) => {
        setProgress(update);
      };
      const plan = await generateMealPlan(userProfile, tdee, onProgressUpdate);
      setDailyPlan(plan);
    } catch (err) {
      setError('Failed to regenerate meal plan. Please try again later.');
      console.error(err);
    } finally {
      setProgress(null);
    }
  }, [userProfile, setDailyPlan]);

  const handleMealSwap = (updatedPlan: DailyPlan) => {
    setDailyPlan(updatedPlan);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header onReset={userProfile ? handleReset : undefined} />
      <main className="container mx-auto p-4 md:p-6">
        {progress !== null ? (
          <LoadingProgress percentage={progress.percentage} message={progress.message} />
        ) : error ? (
          <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">An Error Occurred</h2>
            <p>{error}</p>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Start Over
            </button>
          </div>
        ) : userProfile ? (
          <Dashboard
            userProfile={userProfile}
            dailyPlan={dailyPlan}
            regeneratePlan={regeneratePlan}
            onMealSwap={handleMealSwap}
          />
        ) : (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
      </main>

      {userProfile && progress === null && (
        <>
          <ChatbotFab onClick={() => setIsChatOpen(true)} />
          {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} />}
        </>
      )}

      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>QaloriAI - AI Powered</p>
      </footer>
    </div>
  );
};

export default App;
