
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { UserProfile, DailyPlan, MealType, Meal } from '../types';
import { LOADING_QUOTES } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development environments where the user might not have set up the key.
  // In a production environment, the key should always be present.
  console.warn("API_KEY environment variable not set. App will not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

type ProgressCallback = (update: { percentage: number; message: string }) => void;

const mealSchema = {
  type: Type.OBJECT,
  properties: {
    recipeName: { type: Type.STRING },
    calories: { type: Type.NUMBER },
    macros: {
      type: Type.OBJECT,
      properties: {
        protein: { type: Type.NUMBER },
        carbs: { type: Type.NUMBER },
        fat: { type: Type.NUMBER },
      },
      required: ['protein', 'carbs', 'fat']
    },
    ingredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ['recipeName', 'calories', 'macros', 'ingredients', 'instructions']
};

const dailyPlanSchema = {
    type: Type.OBJECT,
    properties: {
        breakfast: mealSchema,
        morningSnack: mealSchema,
        lunch: mealSchema,
        afternoonSnack: mealSchema,
        dinner: mealSchema,
        eveningSnack: mealSchema,
        totalCalories: { type: Type.NUMBER },
        totalMacros: {
            type: Type.OBJECT,
            properties: {
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fat: { type: Type.NUMBER },
            },
            required: ['protein', 'carbs', 'fat']
        },
    },
    required: ['breakfast', 'morningSnack', 'lunch', 'afternoonSnack', 'dinner', 'eveningSnack', 'totalCalories', 'totalMacros']
};

const generatePrompt = (profile: UserProfile, tdee: number): string => {
  return `
    Create a daily meal plan for a ${profile.age}-year-old ${profile.sex.toLowerCase()} who is ${profile.height} cm tall and weighs ${profile.weight} kg.
    Their activity level is "${profile.activityLevel}" and their primary goal is to "${profile.goal}".
    The target daily calorie intake is approximately ${tdee.toFixed(0)} calories.
    
    Dietary Preferences: ${profile.dietaryPreferences.length > 0 ? profile.dietaryPreferences.join(', ') : 'None'}.
    Allergies: ${profile.allergies || 'None'}. Please strictly avoid any ingredients related to these allergies.

    The plan should include 6 meals (breakfast, morning snack, lunch, afternoon snack, dinner, and evening snack).
    For each meal, provide a recipe name, total calories, macronutrient breakdown (protein, carbs, fat in grams), a list of ingredients, and step-by-step cooking instructions.
    Also, calculate the total calories and macros for the entire day.
    Ensure the total calories for the day are close to the target of ${tdee.toFixed(0)} kcal.
    Provide the response in a valid JSON format that adheres to the provided schema.
  `;
};

const generateSwapPrompt = (profile: UserProfile, tdee: number, mealType: MealType, currentPlan: DailyPlan): string => {
    const mealToSwap = currentPlan[mealType];
    const otherMeals = (Object.keys(currentPlan) as MealType[]).filter(mt => mt !== mealType && currentPlan[mt] && typeof currentPlan[mt] === 'object' && 'recipeName' in currentPlan[mt]);
    const otherMealNames = otherMeals.map(mt => currentPlan[mt].recipeName).join(', ');

    return `
    I need to swap a meal in my daily plan. My profile is: ${profile.age}-year-old ${profile.sex.toLowerCase()}, ${profile.height}cm, ${profile.weight}kg. Goal: ${profile.goal}. Activity: ${profile.activityLevel}.
    My daily calorie target is ~${tdee.toFixed(0)} kcal.
    Dietary Preferences: ${profile.dietaryPreferences.length > 0 ? profile.dietaryPreferences.join(', ') : 'None'}.
    Allergies: ${profile.allergies || 'None'}.

    The meal to swap is my ${mealType}: "${mealToSwap.recipeName}". It has ${mealToSwap.calories} calories.
    My other meals for the day are: ${otherMealNames}.

    Please suggest a NEW and DIFFERENT ${mealType} recipe that has a similar calorie count (${mealToSwap.calories} kcal) and macronutrient profile.
    It must not be "${mealToSwap.recipeName}" or any of my other meals for the day.
    Provide the response as a single JSON object for the new meal, following the provided schema.
  `;
};


export const generateMealImage = async (recipeName: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: `A delicious, professionally photographed image of "${recipeName}" on a clean plate or bowl, presented appetizingly with good lighting, ready to eat.`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
    } catch (error) {
        console.error(`Failed to generate image for ${recipeName}:`, error);
    }
    return ''; // Return empty string or a placeholder URL on failure
};


export const generateMealPlan = async (profile: UserProfile, tdee: number, onProgressUpdate: ProgressCallback): Promise<DailyPlan> => {
  onProgressUpdate({ percentage: 10, message: LOADING_QUOTES[0] });
  const prompt = generatePrompt(profile, tdee);
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: dailyPlanSchema,
    }
  });

  onProgressUpdate({ percentage: 25, message: LOADING_QUOTES[1] });
  const text = response.text.trim();
  try {
    const plan = JSON.parse(text) as DailyPlan;
    
    onProgressUpdate({ percentage: 35, message: LOADING_QUOTES[2] });

    const mealTypes: MealType[] = ['breakfast', 'morningSnack', 'lunch', 'afternoonSnack', 'dinner', 'eveningSnack'];
    
    // Parallel image generation for speed
    const imagePromises = mealTypes.map(mealType => {
      const meal = plan[mealType];
      return meal ? generateMealImage(meal.recipeName) : Promise.resolve('');
    });

    const imageUrls = await Promise.all(imagePromises);

    onProgressUpdate({ percentage: 95, message: LOADING_QUOTES[3] });

    mealTypes.forEach((mealType, index) => {
      if (plan[mealType]) {
        plan[mealType].imageUrl = imageUrls[index];
      }
    });
    
    onProgressUpdate({ percentage: 100, message: "Done!" });

    return plan;
  } catch (e) {
    console.error("Failed to parse meal plan JSON:", text, e);
    throw new Error("Received an invalid format from the AI for the meal plan.");
  }
};

export const generateMealSwap = async (profile: UserProfile, tdee: number, mealType: MealType, currentPlan: DailyPlan): Promise<Meal> => {
  const prompt = generateSwapPrompt(profile, tdee, mealType, currentPlan);
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: mealSchema,
    }
  });
  
  const text = response.text.trim();
  try {
    const newMeal = JSON.parse(text) as Meal;
    // Image generation is removed for speed. It will be handled by the UI.
    return newMeal;
  } catch(e) {
    console.error("Failed to parse meal swap JSON:", text, e);
    throw new Error("Received an invalid format from the AI for the meal swap.");
  }
};


// --- Chat Service ---
let chat: Chat | null = null;

export const startChat = () => {
  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a friendly and helpful nutrition and fitness assistant for the QaloriAI app. Provide encouraging and accurate information. Keep answers concise and easy to understand. Use emojis to make the conversation more engaging.',
    },
  });
};

export const sendMessage = async (message: string) => {
  if (!chat) {
    startChat();
  }
  if (chat) {
    try {
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch(e) {
        console.error("Chat Error:", e);
        return "Sorry, I encountered an error. Please try again."
    }
  }
  return "Sorry, I'm having trouble connecting right now.";
};
