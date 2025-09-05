// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

// export const getGeminiResponse = async (prompt: string) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     return response.text();
//   } catch (error) {
//     console.error("Error calling Gemini AI:", error);
//     throw error;
//   }
// };


// Claude Code (1)

// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Type guard to check if we're in a browser environment
// const getGeminiApiKey = (): string => {
//   if (typeof window !== 'undefined' && import.meta?.env?.VITE_GEMINI_KEY) {
//     return import.meta.env.VITE_GEMINI_KEY;
//   }
  
//   // Fallback for server-side or if import.meta.env is not available
//   const apiKey = process.env.VITE_GEMINI_KEY || process.env.REACT_APP_GEMINI_KEY;
  
//   if (!apiKey) {
//     throw new Error("Gemini API key is not configured. Please set VITE_GEMINI_KEY in your environment variables.");
//   }
  
//   return apiKey;
// };

// // Initialize Gemini AI with error handling
// let genAI: GoogleGenerativeAI;

// try {
//   const apiKey = getGeminiApiKey();
//   genAI = new GoogleGenerativeAI(apiKey);
// } catch (error) {
//   console.error("Failed to initialize Gemini AI:", error);
// }

// export const getGeminiResponse = async (prompt: string, imageData?: string): Promise<string> => {
//   try {
//     if (!genAI) {
//       throw new Error("Gemini AI is not properly initialized. Please check your API key configuration.");
//     }

//     if (!prompt || prompt.trim().length === 0) {
//       throw new Error("Prompt cannot be empty");
//     }

//     // Choose the appropriate model based on whether we have image data
//     const modelName = imageData ? "gemini-2.0-flash" : "gemini-2.0-flash";
//     const model = genAI.getGenerativeModel({ model: modelName });

//     let result;
    
//     if (imageData) {
//       // Handle image analysis
//       try {
//         // Convert base64 to the format expected by Gemini
//         const imageBase64 = imageData.split(',')[1]; // Remove data:image/jpeg;base64, prefix
//         const imageParts = [
//           {
//             inlineData: {
//               data: imageBase64,
//               mimeType: "image/jpeg" // Adjust based on actual image type
//             }
//           }
//         ];
        
//         result = await model.generateContent([prompt, ...imageParts]);
//       } catch (imageError) {
//         console.error("Error processing image with Gemini:", imageError);
//         throw new Error("Failed to analyze the image. Please try with a different image or without an image.");
//       }
//     } else {
//       // Handle text-only queries
//       result = await model.generateContent(prompt);
//     }

//     const response = await result.response;
//     const text = response.text();
    
//     if (!text || text.trim().length === 0) {
//       throw new Error("Received empty response from Gemini AI");
//     }
    
//     return text;
//   } catch (error: any) {
//     console.error("Error calling Gemini AI:", error);
    
//     // Provide more specific error messages
//     if (error.message?.includes("API_KEY_INVALID")) {
//       throw new Error("Invalid Gemini API key. Please check your VITE_GEMINI_KEY environment variable.");
//     } else if (error.message?.includes("QUOTA_EXCEEDED")) {
//       throw new Error("Gemini API quota exceeded. Please try again later.");
//     } else if (error.message?.includes("RATE_LIMIT_EXCEEDED")) {
//       throw new Error("Too many requests. Please wait a moment before trying again.");
//     } else if (error.message?.includes("SAFETY")) {
//       throw new Error("Content was blocked by safety filters. Please try rephrasing your question.");
//     } else if (error.message?.includes("RECITATION")) {
//       throw new Error("Content may be copyrighted. Please try a different question.");
//     } else {
//       // Re-throw custom errors as-is, wrap others
//       if (error.message && (
//         error.message.includes("not properly initialized") ||
//         error.message.includes("Prompt cannot be empty") ||
//         error.message.includes("Failed to analyze the image")
//       )) {
//         throw error;
//       } else {
//         throw new Error(`Failed to get response from AI: ${error.message || "Unknown error"}`);
//       }
//     }
//   }
// };

// // Helper function to validate image data
// export const validateImageData = (imageData: string): boolean => {
//   try {
//     // Check if it's a valid base64 data URL
//     const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
//     return base64Regex.test(imageData);
//   } catch {
//     return false;
//   }
// };

// // Helper function to get supported image formats
// export const getSupportedImageFormats = (): string[] => {
//   return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
// };





// Claude Code (2)

import { GoogleGenerativeAI } from "@google/generative-ai";

// Type guard to check if we're in a browser environment
const getGeminiApiKey = (): string => {
  if (typeof window !== 'undefined' && import.meta?.env?.VITE_GEMINI_KEY) {
    return import.meta.env.VITE_GEMINI_KEY;
  }
  
  // Fallback for server-side or if import.meta.env is not available
  const apiKey = process.env.VITE_GEMINI_KEY || process.env.REACT_APP_GEMINI_KEY;
  
  if (!apiKey) {
    throw new Error("Gemini API key is not configured. Please set VITE_GEMINI_KEY in your environment variables.");
  }
  
  return apiKey;
};

// Initialize Gemini AI with error handling
let genAI: GoogleGenerativeAI;

try {
  const apiKey = getGeminiApiKey();
  genAI = new GoogleGenerativeAI(apiKey);
} catch (error) {
  console.error("Failed to initialize Gemini AI:", error);
}

// Helper function to convert markdown to plain text
const convertMarkdownToPlainText = (markdownText: string): string => {
  let plainText = markdownText;
  
  // Remove headers (# ## ###)
  plainText = plainText.replace(/^#{1,6}\s+(.*)$/gm, '$1');
  
  // Remove bold and italic formatting (**text** *text*)
  plainText = plainText.replace(/\*\*([^*]+)\*\*/g, '$1');
  plainText = plainText.replace(/\*([^*]+)\*/g, '$1');
  plainText = plainText.replace(/__([^_]+)__/g, '$1');
  plainText = plainText.replace(/_([^_]+)_/g, '$1');
  
  // Remove inline code (`code`)
  plainText = plainText.replace(/`([^`]+)`/g, '$1');
  
  // Remove code blocks (```code```)
  plainText = plainText.replace(/```[\s\S]*?```/g, '');
  
  // Remove links [text](url) - keep only the text
  plainText = plainText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Remove strikethrough (~~text~~)
  plainText = plainText.replace(/~~([^~]+)~~/g, '$1');
  
  // Remove blockquotes (> text)
  plainText = plainText.replace(/^>\s+(.*)$/gm, '$1');
  
  // Remove horizontal rules (---, ***, ___)
  plainText = plainText.replace(/^[-*_]{3,}$/gm, '');
  
  // Convert bullet points to simple dashes
  plainText = plainText.replace(/^[\s]*[-*+]\s+(.*)$/gm, '• $1');
  
  // Convert numbered lists to simple format
  plainText = plainText.replace(/^[\s]*\d+\.\s+(.*)$/gm, '• $1');
  
  // Clean up extra whitespace and line breaks
  plainText = plainText.replace(/\n{3,}/g, '\n\n');
  plainText = plainText.trim();
  
  return plainText;
};

export const getGeminiResponse = async (prompt: string, imageData?: string): Promise<string> => {
  try {
    if (!genAI) {
      throw new Error("Gemini AI is not properly initialized. Please check your API key configuration.");
    }

    if (!prompt || prompt.trim().length === 0) {
      throw new Error("Prompt cannot be empty");
    }

    // Enhance the prompt to request plain text responses
    const enhancedPrompt = `${prompt}\n\nPlease provide your response in clear, simple text without markdown formatting, bullet points, or special characters. Use plain language that's easy to read and understand.`;

    // Choose the appropriate model based on whether we have image data
    const modelName = imageData ? "gemini-2.0-flash" : "gemini-2.0-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    let result;
    
    if (imageData) {
      // Handle image analysis
      try {
        // Convert base64 to the format expected by Gemini
        const imageBase64 = imageData.split(',')[1]; // Remove data:image/jpeg;base64, prefix
        const imageParts = [
          {
            inlineData: {
              data: imageBase64,
              mimeType: "image/jpeg" // Adjust based on actual image type
            }
          }
        ];
        
        result = await model.generateContent([enhancedPrompt, ...imageParts]);
      } catch (imageError) {
        console.error("Error processing image with Gemini:", imageError);
        throw new Error("Failed to analyze the image. Please try with a different image or without an image.");
      }
    } else {
      // Handle text-only queries
      result = await model.generateContent(enhancedPrompt);
    }

    const response = await result.response;
    let text = response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error("Received empty response from Gemini AI");
    }
    
    // Convert any remaining markdown to plain text
    text = convertMarkdownToPlainText(text);
    
    return text;
  } catch (error: any) {
    console.error("Error calling Gemini AI:", error);
    
    // Provide more specific error messages
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("Invalid Gemini API key. Please check your VITE_GEMINI_KEY environment variable.");
    } else if (error.message?.includes("QUOTA_EXCEEDED")) {
      throw new Error("Gemini API quota exceeded. Please try again later.");
    } else if (error.message?.includes("RATE_LIMIT_EXCEEDED")) {
      throw new Error("Too many requests. Please wait a moment before trying again.");
    } else if (error.message?.includes("SAFETY")) {
      throw new Error("Content was blocked by safety filters. Please try rephrasing your question.");
    } else if (error.message?.includes("RECITATION")) {
      throw new Error("Content may be copyrighted. Please try a different question.");
    } else {
      // Re-throw custom errors as-is, wrap others
      if (error.message && (
        error.message.includes("not properly initialized") ||
        error.message.includes("Prompt cannot be empty") ||
        error.message.includes("Failed to analyze the image")
      )) {
        throw error;
      } else {
        throw new Error(`Failed to get response from AI: ${error.message || "Unknown error"}`);
      }
    }
  }
};

// Helper function to validate image data
export const validateImageData = (imageData: string): boolean => {
  try {
    // Check if it's a valid base64 data URL
    const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
    return base64Regex.test(imageData);
  } catch {
    return false;
  }
};

// Helper function to get supported image formats
export const getSupportedImageFormats = (): string[] => {
  return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
};