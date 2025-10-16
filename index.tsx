import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Modality } from '@google/genai';
import { marked } from 'marked';

// --- SVG Icons ---
const LogoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.36 2.44a2.5 2.5 0 0 0-2.72 0l-5.68 3.28a2.5 2.5 0 0 0-1.28 2.16v6.24a2.5 2.5 0 0 0 1.28 2.16l5.68 3.28a2.5 2.5 0 0 0 2.72 0l5.68-3.28a2.5 2.5 0 0 0 1.28-2.16V7.88a2.5 2.5 0 0 0-1.28-2.16zM12 13.2V22M10 12l-8-8M14 12l8-8"/>
        <path d="m15.86 10.41-3.46-2-2.86-.83a1 1 0 0 0-1.09.21l-1.8 1.8a1 1 0 0 0 0 1.42l5.4 5.4a1 1 0 0 0 1.42 0l1.8-1.8a1 1 0 0 0 .21-1.09l-.83-2.86-2-3.46Z"/>
    </svg>
);
const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
);
const SourcingIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 15.5 19 19"/><path d="M5 11a7 7 0 1 0 14 0 7 7 0 1 0-14 0z"/></svg>);
const CraftingIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 15a4.2 4.2 0 0 0 4.2-4.2c0-1.3-1.6-3.2-4.2-6.3-2.6 3.1-4.2 5-4.2 6.3A4.2 4.2 0 0 0 12 15Z"/></svg>);
const PlatingIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M7 21v-2"/><path d="M12 21v-2"/><path d="M17 21v-2"/></svg>);
const TimeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>);
const DifficultyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>);
const CookbookIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>);
const SaveIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>);
const ExportIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>);
const CaloriesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>);
const ProteinIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a2 2 0 0 0 2-2c0-2-2.5-2.5-2.5-4 0-1.5 1-2.5 2.5-2.5.5 0 1.5.5 1.5 1a2 2 0 0 0 4 0c0-4-2.5-6-6-6-3.5 0-6 2.5-6 6a4 4 0 0 0 4 4c0 1.5-2.5 2-2.5 4a2 2 0 0 0 2 2Z"/><path d="M12 2v2"/><path d="m18.6 4-1.4 1.4"/><path d="m5.4 4 1.4 1.4"/></svg>);
const FatIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z"/><path d="M11.83 17.94c-1.35-1-2.83-1.94-2.83-3.94 0-2.21 1.79-4 4-4s4 1.79 4 4c0 2-1.48 2.94-2.83 3.94L12 22l-1.17-1.06z"/></svg>);
const CarbsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 15 9l-1.5-1.5L15 6 9 2 2 9"/><path d="m16 11 3.5 3.5-2.12 2.12L14 13.2V22h-4v-8.8L6.62 16.62 4.5 14.5 8 11"/><path d="m11 11-2-2"/></svg>);


const PLACEHOLDER_IMAGE_URL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z'/%3E%3Cpath d='M7 21v-2'/%3E%3Cpath d='M12 21v-2'/%3E%3Cpath d='M17 21v-2'/%3E%3C/svg%3E";

type Ingredient = {
    text: string;
    checked: boolean;
};

type SavedRecipe = {
    title: string;
    description: string;
    content: string;
    prepTime: string;
    cookTime: string;
    difficulty: string;
    calories: string;
    protein: string;
    fat: string;
    carbs: string;
    ingredientsList: Ingredient[];
    instructionsHtml: string;
    picturedIngredients: string[];
    ingredientImages: string[];
    finalDishImage: string | null;
    personalNotes: string;
};

const ImageWithLoader = ({ src, alt, className, id }: { src: string, alt: string, className?: string, id?: string }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    return (
        <div className={`image-loader-wrapper ${className || ''} ${isLoaded ? 'loaded' : ''}`} id={id}>
            <div className="skeleton-loader"></div>
            <img
                src={src}
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                style={{ opacity: isLoaded ? 1 : 0 }}
            />
        </div>
    );
};

const App = () => {
    const [ingredientsText, setIngredientsText] = useState('');
    const [imageFile, setImageFile] = useState<{inlineData: {data:string, mimeType: string}} | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [recipe, setRecipe] = useState<{title: string; content: string} | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [loadingMessage, setLoadingMessage] = useState('');
    const [loadingStage, setLoadingStage] = useState(0); // 0: idle, 1: sourcing, 2: crafting, 3: plating
    const [ingredientImages, setIngredientImages] = useState<string[]>([]);
    const [picturedIngredients, setPicturedIngredients] = useState<string[]>([]);
    const [finalDishImage, setFinalDishImage] = useState<string | null>(null);

    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [fat, setFat] = useState('');
    const [carbs, setCarbs] = useState('');
    const [recipeDescription, setRecipeDescription] = useState('');
    const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);
    const [instructionsHtml, setInstructionsHtml] = useState('');
    const [personalNotes, setPersonalNotes] = useState('');
    
    const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
    const [isCookbookOpen, setIsCookbookOpen] = useState(false);
    const [isCookbookLoading, setIsCookbookLoading] = useState(false);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const getRefinedIngredientForImage = (ingredient: string): string => {
        const lowerIngredient = ingredient.toLowerCase().trim();
        const animalToCutMap: { [key: string]: string } = {
            'chicken': 'chicken breast',
            'cow': 'beef steak',
            'beef': 'beef steak',
            'pig': 'pork chop',
            'pork': 'pork chop',
            'lamb': 'lamb chop',
            'sheep': 'lamb chop',
            'turkey': 'turkey breast',
            'duck': 'duck breast',
            'fish': 'fish fillet',
            'salmon': 'salmon fillet',
            'tuna': 'tuna steak',
            'cod': 'cod fillet',
            'shrimp': 'peeled shrimp',
            'prawns': 'peeled prawns',
            'crab': 'crab meat',
            'lobster': 'lobster tail',
        };

        // Only replace if it's a general, single-word animal name to avoid issues with phrases like "chicken stock"
        if (lowerIngredient.split(' ').length === 1 && animalToCutMap[lowerIngredient]) {
            return animalToCutMap[lowerIngredient];
        }

        return ingredient;
    };

    useEffect(() => {
        if (isCookbookOpen) {
            setIsCookbookLoading(true);
            // Simulate fetch to allow UI to render loading state, as localStorage is synchronous
            setTimeout(() => {
                try {
                    const storedRecipes = localStorage.getItem('recipeGenius-savedRecipes');
                    if (storedRecipes) {
                        setSavedRecipes(JSON.parse(storedRecipes));
                    } else {
                        setSavedRecipes([]); // Ensure it's an empty array if nothing is stored
                    }
                } catch (error) {
                    console.error("Could not load saved recipes:", error);
                    setSavedRecipes([]); // Reset on error
                } finally {
                    setIsCookbookLoading(false);
                }
            }, 200); // Small delay to make loader visible
        }
    }, [isCookbookOpen]);

    const fileToGenerativePart = async (file: File) => {
        const base64EncodedDataPromise = new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.readAsDataURL(file);
        });
        return {
            inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
        };
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIngredientsText('');
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            const generativePart = await fileToGenerativePart(file);
            setImageFile(generativePart);
        }
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setIngredientsText(event.target.value);
        if (imageFile) {
            setImageFile(null);
            setImagePreview(null);
        }
    };

    const generateImage = async (prompt: string) => {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: prompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });
            const part = response.candidates?.[0]?.content?.parts?.[0];
            if (part?.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        } catch (e) {
            console.error("Image generation failed:", e);
        }
        return null;
    }

    const generateRecipe = async () => {
        if (!ingredientsText && !imageFile) {
            setError('Please provide ingredients or an image.');
            return;
        }
        startOver(false);
        setLoading(true);
        setError(null);

        try {
            setLoadingStage(1);
            setLoadingMessage('Mise en place... getting your ingredients ready');
            let ingredientsString = '';
            if (imageFile) {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: { parts: [imageFile, { text: 'Based on this image, list the main ingredients you see. Provide a simple, comma-separated list. For example: chicken breast, broccoli florets, white rice.' }] }
                });
                ingredientsString = response.text;
            } else {
                ingredientsString = ingredientsText;
            }

            if (!ingredientsString) throw new Error("Could not identify any ingredients. Please try again.");
            
            const ingredientsArray = ingredientsString.split(',').map(item => item.trim()).filter(Boolean);
            setPicturedIngredients(ingredientsArray);

            const generatedImages: string[] = [];
            for (let i = 0; i < ingredientsArray.length; i++) {
                const originalIngredient = ingredientsArray[i];
                const refinedIngredient = getRefinedIngredientForImage(originalIngredient);
                const imageUrl = await generateImage(`A high-quality, vibrant photograph of a single ${refinedIngredient}, isolated on a clean, white background.`);
                if (imageUrl) generatedImages.push(imageUrl);
            }
            setIngredientImages(generatedImages);

            setLoadingStage(2);
            setLoadingMessage('Simmering on a great idea...');

            const creativeKeywords = ['extra', 'add', 'suggest', 'creative', 'special', 'elevate'];
            const isCreativeRequest = creativeKeywords.some(keyword => ingredientsText.toLowerCase().includes(keyword));

            const basePromptStructure = `
Your response must be structured exactly as follows, with each piece of metadata on its own line:
PREP_TIME: [e.g., 15 minutes]
COOK_TIME: [e.g., 30 minutes]
DIFFICULTY: [e.g., Easy, Medium, Hard]
CALORIES: [e.g., 450 kcal]
PROTEIN: [e.g., 30g]
FAT: [e.g., 20g]
CARBS: [e.g., 40g]
TITLE: [Recipe Title]
DESCRIPTION: [A short, one-sentence, enticing description of the dish.]
[Leave one blank line here]
Then, provide the full recipe content in Markdown, starting with the recipe title as a main heading (##), followed by ### Ingredients and ### Instructions. Under ### Ingredients, list each ingredient on a new line prefixed with a hyphen.`;

            let recipePrompt = '';

            if (imageFile || isCreativeRequest) {
                // Use the more lenient prompt for images or when explicitly requested for more ingredients
                recipePrompt = `You are a master chef. Create a delicious recipe using the following ingredients: ${ingredientsString}.
The recipe should primarily use the ingredients provided. You may add up to a maximum of 5 common pantry staples (like salt, pepper, oil, water, flour) if they are essential for the recipe. Provide an estimated nutritional breakdown per serving.
${basePromptStructure}`;
            } else {
                // Use the strict prompt for basic text requests to avoid adding extra ingredients
                recipePrompt = `You are a master chef. Create a simple recipe using ONLY the following ingredients: ${ingredientsString}.
It is crucial that you DO NOT add any extra ingredients, except for the absolute essentials: salt, pepper, water, and cooking oil. These should only be used if fundamentally necessary. The goal is the most basic dish from the provided list. Provide an estimated nutritional breakdown per serving.
${basePromptStructure}`;
            }

            const recipeResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [{ text: recipePrompt }] },
            });
            
            const rawRecipe = recipeResponse.text;
            const lines = rawRecipe.split('\n');
            const newPrepTime = lines.find(l => l.startsWith('PREP_TIME:'))?.split(': ')[1] ?? 'N/A';
            const newCookTime = lines.find(l => l.startsWith('COOK_TIME:'))?.split(': ')[1] ?? 'N/A';
            const newDifficulty = lines.find(l => l.startsWith('DIFFICULTY:'))?.split(': ')[1] ?? 'N/A';
            const newCalories = lines.find(l => l.startsWith('CALORIES:'))?.split(': ')[1] ?? 'N/A';
            const newProtein = lines.find(l => l.startsWith('PROTEIN:'))?.split(': ')[1] ?? 'N/A';
            const newFat = lines.find(l => l.startsWith('FAT:'))?.split(': ')[1] ?? 'N/A';
            const newCarbs = lines.find(l => l.startsWith('CARBS:'))?.split(': ')[1] ?? 'N/A';
            const newTitle = lines.find(l => l.startsWith('TITLE:'))?.split(': ')[1] ?? 'Generated Recipe';
            const newDescription = lines.find(l => l.startsWith('DESCRIPTION:'))?.split(': ')[1] ?? '';
            
            setPrepTime(newPrepTime);
            setCookTime(newCookTime);
            setDifficulty(newDifficulty);
            setCalories(newCalories);
            setProtein(newProtein);
            setFat(newFat);
            setCarbs(newCarbs);
            setRecipeDescription(newDescription);

            const contentStartIndex = lines.findIndex(l => l.startsWith('##'));
            const recipeContent = lines.slice(contentStartIndex).join('\n');
            setRecipe({ title: newTitle, content: await marked.parse(recipeContent) });

            // Parse ingredients for checklist
            const ingredientsSection = recipeContent.split(/###\s?Ingredients/i)[1]?.split(/###\s?Instructions/i)[0];
            if (ingredientsSection) {
                const list = ingredientsSection.match(/- .+/g)?.map(item => ({ text: item.replace(/- /, '').trim(), checked: false })) || [];
                setIngredientsList(list);
            }

            // Parse instructions separately
            const instructionsSection = recipeContent.split(/###\s?Instructions/i)[1];
            if (instructionsSection) {
                const instructionsMarkdown = `### Instructions\n${instructionsSection}`;
                setInstructionsHtml(await marked.parse(instructionsMarkdown));
            } else {
                setInstructionsHtml(''); // Clear if not found
            }

            setLoadingStage(3);
            setLoadingMessage('Adding the final garnish...');
            const finalDishImagePrompt = `A delicious and appetizing, professionally shot photograph of "${newTitle}" food version, beautifully plated and ready to eat.`;
            const generatedFinalDishImage = await generateImage(finalDishImagePrompt);
            if (generatedFinalDishImage) setFinalDishImage(generatedFinalDishImage);

        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to generate recipe. Please try again.');
        } finally {
            setLoading(false);
            setLoadingStage(0);
        }
    };
    
    const startOver = (fullReset = true) => {
        if (fullReset) {
            setIngredientsText('');
            setImageFile(null);
            setImagePreview(null);
            const fileInput = document.getElementById('file-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        }
        setRecipe(null);
        setError(null);
        setLoading(false);
        setLoadingStage(0);
        setIngredientImages([]);
        setPicturedIngredients([]);
        setFinalDishImage(null);
        setLoadingMessage('');
        setPrepTime('');
        setCookTime('');
        setDifficulty('');
        setCalories('');
        setProtein('');
        setFat('');
        setCarbs('');
        setRecipeDescription('');
        setIngredientsList([]);
        setInstructionsHtml('');
        setPersonalNotes('');
    };

    const toggleIngredient = (index: number) => {
        setIngredientsList(prev => prev.map((item, i) => i === index ? { ...item, checked: !item.checked } : item));
    };

    const handleSaveRecipe = () => {
        if (!recipe) return;

        const recipeToSave: SavedRecipe = {
            title: recipe.title,
            description: recipeDescription,
            content: recipe.content,
            prepTime,
            cookTime,
            difficulty,
            calories,
            protein,
            fat,
            carbs,
            ingredientsList,
            instructionsHtml,
            picturedIngredients,
            ingredientImages,
            finalDishImage,
            personalNotes: personalNotes,
        };

        const existingRecipeIndex = savedRecipes.findIndex(r => r.title === recipe.title);
        let newSavedRecipes;

        if (existingRecipeIndex > -1) {
            newSavedRecipes = [...savedRecipes];
            newSavedRecipes[existingRecipeIndex] = recipeToSave;
        } else {
            newSavedRecipes = [...savedRecipes, recipeToSave];
        }

        setSavedRecipes(newSavedRecipes);
        localStorage.setItem('recipeGenius-savedRecipes', JSON.stringify(newSavedRecipes));
    };

    const handleExportRecipe = () => {
        if (!recipe) return;

        // Convert HTML instructions to plain text by rendering to a temporary div
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = instructionsHtml;
        const plainInstructions = tempDiv.innerText;

        const ingredientsTextForExport = ingredientsList.map(item => `- ${item.text}`).join('\n');

        const fileContent = `RECIPE: ${recipe.title}
${recipeDescription}

=================================
INFO
=================================
Prep Time: ${prepTime}
Cook Time: ${cookTime}
Difficulty: ${difficulty}

=================================
NUTRITION (approx. per serving)
=================================
Calories: ${calories}
Protein: ${protein}
Fat: ${fat}
Carbs: ${carbs}

=================================
INGREDIENTS
=================================
${ingredientsTextForExport}

=================================
INSTRUCTIONS
=================================
${plainInstructions}

=================================
PERSONAL NOTES
=================================
${personalNotes || 'No notes added yet.'}
`;

        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        // Sanitize title for filename
        const safeFilename = recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.download = `${safeFilename}.txt`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    
    const handleDeleteRecipe = (titleToDelete: string) => {
        const newSavedRecipes = savedRecipes.filter(r => r.title !== titleToDelete);
        setSavedRecipes(newSavedRecipes);
        localStorage.setItem('recipeGenius-savedRecipes', JSON.stringify(newSavedRecipes));
    };

    const handleViewRecipe = (recipeToView: SavedRecipe) => {
        startOver(true);
        setRecipe({ title: recipeToView.title, content: recipeToView.content });
        setRecipeDescription(recipeToView.description);
        setPrepTime(recipeToView.prepTime);
        setCookTime(recipeToView.cookTime);
        setDifficulty(recipeToView.difficulty);
        setCalories(recipeToView.calories || 'N/A');
        setProtein(recipeToView.protein || 'N/A');
        setFat(recipeToView.fat || 'N/A');
        setCarbs(recipeToView.carbs || 'N/A');
        setIngredientsList(recipeToView.ingredientsList);
        setInstructionsHtml(recipeToView.instructionsHtml || '');
        setPicturedIngredients(recipeToView.picturedIngredients || []);
        setIngredientImages(recipeToView.ingredientImages);
        setFinalDishImage(recipeToView.finalDishImage);
        setPersonalNotes(recipeToView.personalNotes || '');
        setIsCookbookOpen(false);
    };

    const isRecipeSaved = recipe ? savedRecipes.some(r => r.title === recipe.title) : false;

    return (
        <main>
            <header>
                <h1><LogoIcon /> Recipe Genius</h1>
                <button id="cookbook-button" onClick={() => setIsCookbookOpen(true)}>
                    <CookbookIcon /> My Cookbook {savedRecipes.length > 0 && <span className="count-badge">{savedRecipes.length}</span>}
                </button>
            </header>

            {!recipe && !loading && (
                <div className="welcome-screen">
                    <p>What's in your pantry today? Let's create something delicious.</p>
                    <div className="form-group">
                        <textarea
                            id="ingredients-input"
                            value={ingredientsText}
                            onChange={handleTextChange}
                            placeholder="e.g., chicken, rice, broccoli, garlic..."
                            aria-label="Enter your ingredients, separated by commas"
                        />
                        <div className="divider">OR</div>
                        <div className="file-input-wrapper">
                             <div className="file-input-button" role="button" aria-label="Upload image button">
                                <CameraIcon /> Snap a photo of your ingredients
                            </div>
                            <input
                                id="file-input"
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleImageChange}
                                aria-label="Upload an image of your ingredients"
                            />
                        </div>
                        {imagePreview && <img id="image-preview" src={imagePreview} alt="Ingredients preview" />}
                    </div>
                </div>
            )}

            {error && <div className="error-message" role="alert">{error}</div>}

            {loading && (
                <div className="loading-container" aria-label="Loading recipe">
                    <div className="progress-bar">
                        <div className="progress-line"></div>
                        <div className="progress-line-active" style={{ width: `${(loadingStage - 1) * 50}%` }}></div>
                        <div className={`progress-step ${loadingStage >= 1 ? 'active' : ''}`}>
                            <div className="progress-icon"><SourcingIcon /></div>
                        </div>
                        <div className={`progress-step ${loadingStage >= 2 ? 'active' : ''}`}>
                            <div className="progress-icon"><CraftingIcon /></div>
                        </div>
                        <div className={`progress-step ${loadingStage >= 3 ? 'active' : ''}`}>
                            <div className="progress-icon"><PlatingIcon /></div>
                        </div>
                    </div>
                    <p className="loading-text">{loadingMessage}</p>
                </div>
            )}
            
            {recipe && (
                <div id="recipe-container">
                    <div id="recipe-visuals">
                         {finalDishImage && <ImageWithLoader src={finalDishImage} alt="The final cooked dish" id="final-dish-image-wrapper" />}
                         {ingredientImages.length > 0 && (
                            <div className="ingredient-gallery">
                                <h3>Your Ingredients</h3>
                                <div className="ingredient-grid">
                                    {ingredientImages.map((src, index) => (
                                         <div key={index} className="ingredient-card">
                                            <ImageWithLoader src={src} alt={picturedIngredients[index] || `Generated ingredient image ${index + 1}`} />
                                            <div className="ingredient-caption">{picturedIngredients[index]}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div id="recipe-details">
                        <h2>{recipe.title}</h2>
                        {recipeDescription && <p className="recipe-description">{recipeDescription}</p>}
                        <div className="info-bar">
                            {prepTime !== 'N/A' && <div className="info-item"><TimeIcon /><strong>Prep:</strong> {prepTime}</div>}
                            {cookTime !== 'N/A' && <div className="info-item"><TimeIcon /><strong>Cook:</strong> {cookTime}</div>}
                            {difficulty !== 'N/A' && <div className="info-item"><DifficultyIcon /><strong>Difficulty:</strong> {difficulty}</div>}
                        </div>
                        
                        <div className="nutrition-facts">
                            <h3>Nutrition Facts</h3>
                            <div className="nutrition-grid">
                                {calories !== 'N/A' && <div className="nutrition-item"><CaloriesIcon /><strong>Calories:</strong> {calories}</div>}
                                {protein !== 'N/A' && <div className="nutrition-item"><ProteinIcon /><strong>Protein:</strong> {protein}</div>}
                                {fat !== 'N/A' && <div className="nutrition-item"><FatIcon /><strong>Fat:</strong> {fat}</div>}
                                {carbs !== 'N/A' && <div className="nutrition-item"><CarbsIcon /><strong>Carbs:</strong> {carbs}</div>}
                            </div>
                        </div>

                        <div id="recipe-content">
                             {ingredientsList.length > 0 ? (
                                <>
                                    <h3>Ingredients</h3>
                                    <ul className="ingredient-checklist">
                                        {ingredientsList.map((item, index) => (
                                            <li key={index}>
                                                <label>
                                                    <input type="checkbox" checked={item.checked} onChange={() => toggleIngredient(index)} />
                                                    <span>{item.text}</span>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                    <div dangerouslySetInnerHTML={{ __html: instructionsHtml }} />
                                </>
                             ) : (
                                <div dangerouslySetInnerHTML={{ __html: recipe.content }} />
                             )}
                        </div>
                        <div id="notes-section">
                            <h3>Personal Notes</h3>
                            <textarea
                                value={personalNotes}
                                onChange={(e) => setPersonalNotes(e.target.value)}
                                placeholder="Add your own notes, tweaks, or serving suggestions here..."
                            />
                        </div>
                    </div>
                </div>
            )}
            
            <div className="button-group">
                {(recipe || error) && (
                    <button className="btn-secondary" onClick={() => startOver(true)}>Start New Recipe</button>
                )}
                {recipe && ingredientsText && !loading && (
                    <button className="btn-accent" onClick={generateRecipe}>Generate Another Idea</button>
                )}
                {recipe && !loading && (
                    <button className={`btn-save ${isRecipeSaved ? 'saved' : ''}`} onClick={handleSaveRecipe}>
                        <SaveIcon /> {isRecipeSaved ? 'Update Recipe' : 'Save Recipe'}
                    </button>
                )}
                {recipe && !loading && (
                     <button className="btn-secondary" onClick={handleExportRecipe}>
                        <ExportIcon /> Export Recipe
                    </button>
                )}
                 {!recipe && !loading && (
                    <button 
                        className="btn-primary" 
                        onClick={generateRecipe}
                        disabled={loading || (!ingredientsText && !imageFile)}
                    >
                        Generate Recipe
                    </button>
                 )}
            </div>

            {isCookbookOpen && (
                <div className="cookbook-overlay">
                    <div className="cookbook-modal">
                        <div className="cookbook-header">
                            <h2>My Cookbook</h2>
                            <button className="cookbook-close-btn" onClick={() => setIsCookbookOpen(false)}>&times;</button>
                        </div>
                        <ul className="saved-recipes-list">
                            {isCookbookLoading ? (
                                <div className="cookbook-loader">Loading recipes...</div>
                            ) : savedRecipes.length > 0 ? (
                                savedRecipes.map((savedRecipe, index) => (
                                <li key={index} className="saved-recipe-item">
                                    <img src={savedRecipe.finalDishImage || PLACEHOLDER_IMAGE_URL} alt={savedRecipe.title} />
                                    <p>{savedRecipe.title}</p>
                                    <div className="saved-recipe-actions">
                                        <button className="btn-primary" onClick={() => handleViewRecipe(savedRecipe)}>View</button>
                                        <button className="btn-delete" onClick={() => handleDeleteRecipe(savedRecipe.title)}><TrashIcon/></button>
                                    </div>
                                </li>
                                ))
                            ) : (
                                <p>You have no saved recipes yet.</p>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </main>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}