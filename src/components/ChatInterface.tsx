// import { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { 
//   Send, 
//   Mic, 
//   MicOff, 
//   Image as ImageIcon, 
//   User, 
//   Bot,
//   ThumbsUp,
//   ThumbsDown,
//   Camera,
//   Upload
// } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
// import aiAssistant from "@/assets/ai-assistant.png";
// import { getGeminiResponse } from "@/services/gemini_service";

// interface Message {
//   id: string;
//   type: 'user' | 'bot';
//   content: string;
//   timestamp: Date;
//   imageUrl?: string;
//   feedback?: 'positive' | 'negative';
// }

// // Chat and Weather Service
// interface ImportMetaEnv {
//   readonly VITE_SUPABASE_PROJECT_ID: string
//   readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
//   readonly VITE_SUPABASE_URL: string
//   readonly VITE_GEMINI_KEY: string
//   readonly VITE_OPENWEATHER_KEY: string
// }

// interface ImportMeta {
//   readonly env: ImportMetaEnv
// }

// const ChatInterface = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       type: 'bot',
//       content: 'Hello! I\'m your AI farming assistant. I can help you with crop advice, disease identification, weather guidance, and market information. How can I assist you today?',
//       timestamp: new Date(),
//     }
//   ]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(scrollToBottom, [messages]);

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       type: 'user',
//       content: inputMessage,
//       timestamp: new Date(),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     const currentInput = inputMessage;
//     setInputMessage('');
//     setIsLoading(true);

//     // try {
//     //   // Call the AI chat edge function
//     //   const { data, error } = await supabase.functions.invoke('ai-chat', {
//     //     body: { 
//     //       question: currentInput,
//     //       language: 'en' // TODO: Get from user preferences
//     //     }
//     //   });

//     //   if (error) {
//     //     throw error;
//     //   }

//     //   const botResponse: Message = {
//     //     id: (Date.now() + 1).toString(),
//     //     type: 'bot',
//     //     content: data.response || 'I apologize, but I could not process your question. Please try again.',
//     //     timestamp: new Date(),
//     //   };
      
//     //   setMessages(prev => [...prev, botResponse]);
//     // } catch (error) {
//     //   console.error('Error calling AI chat:', error);
      
//     //   const errorMessage: Message = {
//     //     id: (Date.now() + 1).toString(),
//     //     type: 'bot',
//     //     content: 'I\'m having trouble connecting right now. Please check your connection and try again. In the meantime, here are some general farming tips:\n\n• Check soil moisture before watering\n• Monitor weather forecasts daily\n• Inspect crops for pests regularly\n• Maintain proper crop spacing',
//     //     timestamp: new Date(),
//     //   };
      
//     //   setMessages(prev => [...prev, errorMessage]);
//     // } finally {
//     //   setIsLoading(false);
//     // }

//     try {
//       const response = await getGeminiResponse(currentInput);
      
//       const botResponse: Message = {
//         id: (Date.now() + 1).toString(),
//         type: 'bot',
//         content: response,
//         timestamp: new Date(),
//       };
      
//       setMessages(prev => [...prev, botResponse]);
//     } catch (error) {
//       console.error('Error calling AI chat:', error);
//       const errorMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         type: 'bot',
//         content: 'I\'m having trouble connecting right now. Please check your connection and try again.',
//         timestamp: new Date(),
//       };
      
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         const imageData = e.target?.result as string;
//         const imageUrl = URL.createObjectURL(file);
        
//         const userMessage: Message = {
//           id: Date.now().toString(),
//           type: 'user',
//           content: 'I\'ve uploaded an image for crop disease analysis.',
//           timestamp: new Date(),
//           imageUrl,
//         };
//         setMessages(prev => [...prev, userMessage]);
//         setIsLoading(true);

//         try {
//           // Call the AI chat edge function with image data
//           const { data, error } = await supabase.functions.invoke('ai-chat', {
//             body: { 
//               question: 'Please analyze this crop image for diseases or issues',
//               imageData: imageData,
//               language: 'en'
//             }
//           });

//           if (error) {
//             throw error;
//           }

//           const botResponse: Message = {
//             id: (Date.now() + 1).toString(),
//             type: 'bot',
//             content: data.response || 'I could not analyze the image. Please try uploading a clearer image.',
//             timestamp: new Date(),
//           };
          
//           setMessages(prev => [...prev, botResponse]);
//         } catch (error) {
//           console.error('Error analyzing image:', error);
          
//           const errorMessage: Message = {
//             id: (Date.now() + 1).toString(),
//             type: 'bot',
//             content: 'I\'m having trouble analyzing the image right now. Please try again later or describe the issue you\'re seeing with your crops.',
//             timestamp: new Date(),
//           };
          
//           setMessages(prev => [...prev, errorMessage]);
//         } finally {
//           setIsLoading(false);
//         }
//       };
      
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
//     setMessages(prev => 
//       prev.map(msg => 
//         msg.id === messageId ? { ...msg, feedback } : msg
//       )
//     );
//   };

//   const quickSuggestions = [
//     "What crops are best for this season?",
//     "How to identify pest problems?",
//     "Check weather forecast",
//     "Current market prices",
//     "Organic farming tips",
//     "Irrigation schedule advice"
//   ];

//   return (
//     <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
//       {/* Chat Header */}
//       <div className="bg-card border-b border-border p-4 flex items-center gap-3">
//         <img src={aiAssistant} alt="AI Assistant" className="w-10 h-10 rounded-full" />
//         <div>
//           <h2 className="font-semibold text-lg">AI Farming Assistant</h2>
//           <p className="text-sm text-muted-foreground">Online • Multilingual Support</p>
//         </div>
//       </div>

//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
//           >
//             {/* Bot Avatar */}
//             {message.type === 'bot' && (
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                   <Bot className="h-4 w-4 text-primary" />
//                 </div>
//               </div>
//             )}

//             {/* Message Content */}
//             <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
//               <div className={message.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
//                 {message.imageUrl && (
//                   <img 
//                     src={message.imageUrl} 
//                     alt="Uploaded crop"
//                     className="w-full max-w-xs rounded-lg mb-2"
//                   />
//                 )}
//                 <p className="whitespace-pre-line">{message.content}</p>
//               </div>
              
//               {/* Bot message feedback */}
//               {message.type === 'bot' && (
//                 <div className="flex items-center gap-2 mt-2">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleFeedback(message.id, 'positive')}
//                     className={`h-6 w-6 p-0 ${message.feedback === 'positive' ? 'text-success' : 'text-muted-foreground'}`}
//                   >
//                     <ThumbsUp className="h-3 w-3" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleFeedback(message.id, 'negative')}
//                     className={`h-6 w-6 p-0 ${message.feedback === 'negative' ? 'text-destructive' : 'text-muted-foreground'}`}
//                   >
//                     <ThumbsDown className="h-3 w-3" />
//                   </Button>
//                   <span className="text-xs text-muted-foreground">
//                     {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* User Avatar */}
//             {message.type === 'user' && (
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
//                   <User className="h-4 w-4 text-primary-foreground" />
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}

//         {/* Loading Indicator */}
//         {isLoading && (
//           <div className="flex gap-3 justify-start">
//             <div className="flex-shrink-0">
//               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                 <Bot className="h-4 w-4 text-primary" />
//               </div>
//             </div>
//             <div className="chat-bubble-bot">
//               <div className="flex gap-1">
//                 <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
//                 <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
//                 <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
//               </div>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Quick Suggestions */}
//       <div className="p-4 border-t border-border">
//         <div className="flex gap-2 overflow-x-auto pb-2">
//           {quickSuggestions.map((suggestion, index) => (
//             <Button
//               key={index}
//               variant="outline"
//               size="sm"
//               className="whitespace-nowrap"
//               onClick={() => setInputMessage(suggestion)}
//             >
//               {suggestion}
//             </Button>
//           ))}
//         </div>
//       </div>

//       {/* Input Area */}
//       <div className="p-4 border-t border-border bg-card">
//         <div className="flex gap-2 items-end">
//           {/* Image Upload */}
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => fileInputRef.current?.click()}
//             className="flex-shrink-0"
//           >
//             <ImageIcon className="h-4 w-4" />
//           </Button>
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             onChange={handleImageUpload}
//             className="hidden"
//           />

//           {/* Voice Recording */}
//           <Button
//             variant={isRecording ? "destructive" : "outline"}
//             size="icon"
//             onClick={() => setIsRecording(!isRecording)}
//             className="flex-shrink-0"
//           >
//             {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
//           </Button>

//           {/* Text Input */}
//           <div className="flex-1">
//             <Input
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               placeholder="Ask me anything about farming..."
//               onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//               className="min-h-12"
//             />
//           </div>

//           {/* Send Button */}
//           <Button
//             variant="chat"
//             size="icon"
//             onClick={handleSendMessage}
//             disabled={!inputMessage.trim() || isLoading}
//             className="flex-shrink-0"
//           >
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;





// CLAUDE CODE (1)

// import { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { 
//   Send, 
//   Mic, 
//   MicOff, 
//   Image as ImageIcon, 
//   User, 
//   Bot,
//   ThumbsUp,
//   ThumbsDown,
//   Camera,
//   Upload
// } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
// import aiAssistant from "@/assets/ai-assistant.png";
// import { getGeminiResponse, validateImageData } from "@/services/gemini_service";

// interface Message {
//   id: string;
//   type: 'user' | 'bot';
//   content: string;
//   timestamp: Date;
//   imageUrl?: string;
//   feedback?: 'positive' | 'negative';
// }

// const ChatInterface = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       type: 'bot',
//       content: 'Hello! I\'m your AI farming assistant. I can help you with crop advice, disease identification, weather guidance, and market information. How can I assist you today?',
//       timestamp: new Date(),
//     }
//   ]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(scrollToBottom, [messages]);

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       type: 'user',
//       content: inputMessage,
//       timestamp: new Date(),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     const currentInput = inputMessage;
//     setInputMessage('');
//     setIsLoading(true);

//     try {
//       const response = await getGeminiResponse(currentInput);
      
//       const botResponse: Message = {
//         id: (Date.now() + 1).toString(),
//         type: 'bot',
//         content: response,
//         timestamp: new Date(),
//       };
      
//       setMessages(prev => [...prev, botResponse]);
//     } catch (error: any) {
//       console.error('Error calling AI chat:', error);
      
//       let errorContent = 'I\'m having trouble connecting right now. Please check your connection and try again.';
      
//       // Provide more helpful error messages based on the error type
//       if (error.message?.includes('API key')) {
//         errorContent = 'There seems to be a configuration issue. Please contact support if this continues.';
//       } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
//         errorContent = error.message;
//       } else if (error.message?.includes('safety') || error.message?.includes('blocked')) {
//         errorContent = 'I couldn\'t process that request. Please try rephrasing your question in a different way.';
//       }
      
//       const errorMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         type: 'bot',
//         content: errorContent,
//         timestamp: new Date(),
//       };
      
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith('image/')) {
//       const errorMessage: Message = {
//         id: Date.now().toString(),
//         type: 'bot',
//         content: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP).',
//         timestamp: new Date(),
//       };
//       setMessages(prev => [...prev, errorMessage]);
//       return;
//     }

//     // Check file size (limit to 10MB)
//     if (file.size > 10 * 1024 * 1024) {
//       const errorMessage: Message = {
//         id: Date.now().toString(),
//         type: 'bot',
//         content: 'Image file is too large. Please upload an image smaller than 10MB.',
//         timestamp: new Date(),
//       };
//       setMessages(prev => [...prev, errorMessage]);
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       const imageData = e.target?.result as string;
      
//       // Validate the image data format
//       if (!validateImageData(imageData)) {
//         const errorMessage: Message = {
//           id: Date.now().toString(),
//           type: 'bot',
//           content: 'Invalid image format. Please try uploading a different image.',
//           timestamp: new Date(),
//         };
//         setMessages(prev => [...prev, errorMessage]);
//         return;
//       }

//       const imageUrl = URL.createObjectURL(file);
      
//       const userMessage: Message = {
//         id: Date.now().toString(),
//         type: 'user',
//         content: 'I\'ve uploaded an image for crop disease analysis.',
//         timestamp: new Date(),
//         imageUrl,
//       };
      
//       setMessages(prev => [...prev, userMessage]);
//       setIsLoading(true);

//       try {
//         const response = await getGeminiResponse(
//           'Please analyze this crop image for diseases, pests, or other issues. Provide detailed insights about what you see and any recommendations for treatment or prevention.',
//           imageData
//         );

//         const botResponse: Message = {
//           id: (Date.now() + 1).toString(),
//           type: 'bot',
//           content: response,
//           timestamp: new Date(),
//         };
        
//         setMessages(prev => [...prev, botResponse]);
//       } catch (error: any) {
//         console.error('Error analyzing image:', error);
        
//         let errorContent = 'I\'m having trouble analyzing the image right now. Please try again later or describe the issue you\'re seeing with your crops.';
        
//         if (error.message?.includes('Failed to analyze the image')) {
//           errorContent = error.message;
//         } else if (error.message?.includes('safety') || error.message?.includes('blocked')) {
//           errorContent = 'The image couldn\'t be processed due to content restrictions. Please try a different image.';
//         }
        
//         const errorMessage: Message = {
//           id: (Date.now() + 1).toString(),
//           type: 'bot',
//           content: errorContent,
//           timestamp: new Date(),
//         };
        
//         setMessages(prev => [...prev, errorMessage]);
//       } finally {
//         setIsLoading(false);
//         // Clean up the file input
//         if (fileInputRef.current) {
//           fileInputRef.current.value = '';
//         }
//       }
//     };
    
//     reader.onerror = () => {
//       const errorMessage: Message = {
//         id: Date.now().toString(),
//         type: 'bot',
//         content: 'Failed to read the image file. Please try again.',
//         timestamp: new Date(),
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     };
    
//     reader.readAsDataURL(file);
//   };

//   const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
//     setMessages(prev => 
//       prev.map(msg => 
//         msg.id === messageId ? { ...msg, feedback } : msg
//       )
//     );
//   };

//   const quickSuggestions = [
//     "What crops are best for this season?",
//     "How to identify pest problems?",
//     "Check weather forecast",
//     "Current market prices",
//     "Organic farming tips",
//     "Irrigation schedule advice"
//   ];

//   return (
//     <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
//       {/* Chat Header */}
//       <div className="bg-card border-b border-border p-4 flex items-center gap-3">
//         <img src={aiAssistant} alt="AI Assistant" className="w-10 h-10 rounded-full" />
//         <div>
//           <h2 className="font-semibold text-lg">AI Farming Assistant</h2>
//           <p className="text-sm text-muted-foreground">Online • Multilingual Support</p>
//         </div>
//       </div>

//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
//           >
//             {/* Bot Avatar */}
//             {message.type === 'bot' && (
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                   <Bot className="h-4 w-4 text-primary" />
//                 </div>
//               </div>
//             )}

//             {/* Message Content */}
//             <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
//               <div className={message.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
//                 {message.imageUrl && (
//                   <img 
//                     src={message.imageUrl} 
//                     alt="Uploaded crop"
//                     className="w-full max-w-xs rounded-lg mb-2"
//                     onError={(e) => {
//                       // Handle image loading errors
//                       e.currentTarget.style.display = 'none';
//                     }}
//                   />
//                 )}
//                 <p className="whitespace-pre-line">{message.content}</p>
//               </div>
              
//               {/* Bot message feedback */}
//               {message.type === 'bot' && (
//                 <div className="flex items-center gap-2 mt-2">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleFeedback(message.id, 'positive')}
//                     className={`h-6 w-6 p-0 ${message.feedback === 'positive' ? 'text-success' : 'text-muted-foreground'}`}
//                   >
//                     <ThumbsUp className="h-3 w-3" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleFeedback(message.id, 'negative')}
//                     className={`h-6 w-6 p-0 ${message.feedback === 'negative' ? 'text-destructive' : 'text-muted-foreground'}`}
//                   >
//                     <ThumbsDown className="h-3 w-3" />
//                   </Button>
//                   <span className="text-xs text-muted-foreground">
//                     {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* User Avatar */}
//             {message.type === 'user' && (
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
//                   <User className="h-4 w-4 text-primary-foreground" />
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}

//         {/* Loading Indicator */}
//         {isLoading && (
//           <div className="flex gap-3 justify-start">
//             <div className="flex-shrink-0">
//               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                 <Bot className="h-4 w-4 text-primary" />
//               </div>
//             </div>
//             <div className="chat-bubble-bot">
//               <div className="flex gap-1">
//                 <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
//                 <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
//                 <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
//               </div>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Quick Suggestions */}
//       <div className="p-4 border-t border-border">
//         <div className="flex gap-2 overflow-x-auto pb-2">
//           {quickSuggestions.map((suggestion, index) => (
//             <Button
//               key={index}
//               variant="outline"
//               size="sm"
//               className="whitespace-nowrap"
//               onClick={() => setInputMessage(suggestion)}
//             >
//               {suggestion}
//             </Button>
//           ))}
//         </div>
//       </div>

//       {/* Input Area */}
//       <div className="p-4 border-t border-border bg-card">
//         <div className="flex gap-2 items-end">
//           {/* Image Upload */}
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => fileInputRef.current?.click()}
//             className="flex-shrink-0"
//             disabled={isLoading}
//           >
//             <ImageIcon className="h-4 w-4" />
//           </Button>
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             onChange={handleImageUpload}
//             className="hidden"
//           />

//           {/* Voice Recording */}
//           <Button
//             variant={isRecording ? "destructive" : "outline"}
//             size="icon"
//             onClick={() => setIsRecording(!isRecording)}
//             className="flex-shrink-0"
//             disabled={isLoading}
//           >
//             {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
//           </Button>

//           {/* Text Input */}
//           <div className="flex-1">
//             <Input
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               placeholder="Ask me anything about farming..."
//               onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
//               className="min-h-12"
//               disabled={isLoading}
//             />
//           </div>

//           {/* Send Button */}
//           <Button
//             variant="chat"
//             size="icon"
//             onClick={handleSendMessage}
//             disabled={!inputMessage.trim() || isLoading}
//             className="flex-shrink-0"
//           >
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;



// CLAUDE CODE (2)


// import { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { 
//   Send, 
//   Mic, 
//   MicOff, 
//   Image as ImageIcon, 
//   User, 
//   Bot,
//   ThumbsUp,
//   ThumbsDown,
//   Camera,
//   Upload
// } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
// import aiAssistant from "@/assets/ai-assistant.png";
// import { getGeminiResponse, validateImageData } from "@/services/gemini_service";


// interface Message {
//   id: string;
//   type: 'user' | 'bot';
//   content: string;
//   timestamp: Date;
//   imageUrl?: string;
//   feedback?: 'positive' | 'negative';
// }

// const ChatInterface = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       type: 'bot',
//       content: 'Hello! I\'m your AI farming assistant. I can help you with crop advice, disease identification, weather guidance, and market information. How can I assist you today?',
//       timestamp: new Date(),
//     }
//   ]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(scrollToBottom, [messages]);

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       type: 'user',
//       content: inputMessage,
//       timestamp: new Date(),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     const currentInput = inputMessage;
//     setInputMessage('');
//     setIsLoading(true);

//     try {
//       const response = await getGeminiResponse(currentInput);
      
//       const botResponse: Message = {
//         id: (Date.now() + 1).toString(),
//         type: 'bot',
//         content: response,
//         timestamp: new Date(),
//       };
      
//       setMessages(prev => [...prev, botResponse]);
//     } catch (error: any) {
//       console.error('Error calling AI chat:', error);
      
//       let errorContent = 'I\'m having trouble connecting right now. Please check your connection and try again.';
      
//       // Provide more helpful error messages based on the error type
//       if (error.message?.includes('API key')) {
//         errorContent = 'There seems to be a configuration issue. Please contact support if this continues.';
//       } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
//         errorContent = error.message;
//       } else if (error.message?.includes('safety') || error.message?.includes('blocked')) {
//         errorContent = 'I couldn\'t process that request. Please try rephrasing your question in a different way.';
//       }
      
//       const errorMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         type: 'bot',
//         content: errorContent,
//         timestamp: new Date(),
//       };
      
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith('image/')) {
//       const errorMessage: Message = {
//         id: Date.now().toString(),
//         type: 'bot',
//         content: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP).',
//         timestamp: new Date(),
//       };
//       setMessages(prev => [...prev, errorMessage]);
//       return;
//     }

//     // Check file size (limit to 10MB)
//     if (file.size > 10 * 1024 * 1024) {
//       const errorMessage: Message = {
//         id: Date.now().toString(),
//         type: 'bot',
//         content: 'Image file is too large. Please upload an image smaller than 10MB.',
//         timestamp: new Date(),
//       };
//       setMessages(prev => [...prev, errorMessage]);
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       const imageData = e.target?.result as string;
      
//       // Validate the image data format
//       if (!validateImageData(imageData)) {
//         const errorMessage: Message = {
//           id: Date.now().toString(),
//           type: 'bot',
//           content: 'Invalid image format. Please try uploading a different image.',
//           timestamp: new Date(),
//         };
//         setMessages(prev => [...prev, errorMessage]);
//         return;
//       }

//       const imageUrl = URL.createObjectURL(file);
      
//       const userMessage: Message = {
//         id: Date.now().toString(),
//         type: 'user',
//         content: 'I\'ve uploaded an image for crop disease analysis.',
//         timestamp: new Date(),
//         imageUrl,
//       };
      
//       setMessages(prev => [...prev, userMessage]);
//       setIsLoading(true);

//       try {
//         const response = await getGeminiResponse(
//           'Please analyze this crop image for diseases, pests, or other issues. Provide detailed insights about what you see and any recommendations for treatment or prevention.',
//           imageData
//         );

//         const botResponse: Message = {
//           id: (Date.now() + 1).toString(),
//           type: 'bot',
//           content: response,
//           timestamp: new Date(),
//         };
        
//         setMessages(prev => [...prev, botResponse]);
//       } catch (error: any) {
//         console.error('Error analyzing image:', error);
        
//         let errorContent = 'I\'m having trouble analyzing the image right now. Please try again later or describe the issue you\'re seeing with your crops.';
        
//         if (error.message?.includes('Failed to analyze the image')) {
//           errorContent = error.message;
//         } else if (error.message?.includes('safety') || error.message?.includes('blocked')) {
//           errorContent = 'The image couldn\'t be processed due to content restrictions. Please try a different image.';
//         }
        
//         const errorMessage: Message = {
//           id: (Date.now() + 1).toString(),
//           type: 'bot',
//           content: errorContent,
//           timestamp: new Date(),
//         };
        
//         setMessages(prev => [...prev, errorMessage]);
//       } finally {
//         setIsLoading(false);
//         // Clean up the file input
//         if (fileInputRef.current) {
//           fileInputRef.current.value = '';
//         }
//       }
//     };
    
//     reader.onerror = () => {
//       const errorMessage: Message = {
//         id: Date.now().toString(),
//         type: 'bot',
//         content: 'Failed to read the image file. Please try again.',
//         timestamp: new Date(),
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     };
    
//     reader.readAsDataURL(file);
//   };

//   const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
//     setMessages(prev => 
//       prev.map(msg => 
//         msg.id === messageId ? { ...msg, feedback } : msg
//       )
//     );
//   };

//   const quickSuggestions = [
//     "What crops are best for this season?",
//     "How to identify pest problems?",
//     "Check weather forecast",
//     "Current market prices",
//     "Organic farming tips",
//     "Irrigation schedule advice"
//   ];

//   return (
//     <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
//       {/* Chat Header */}
//       <div className="bg-card border-b border-border p-4 flex items-center gap-3">
//         <img src={aiAssistant} alt="AI Assistant" className="w-10 h-10 rounded-full" />
//         <div>
//           <h2 className="font-semibold text-lg">AI Farming Assistant</h2>
//           <p className="text-sm text-muted-foreground">Online • Multilingual Support</p>
//         </div>
//       </div>

//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
//           >
//             {/* Bot Avatar */}
//             {message.type === 'bot' && (
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                   <Bot className="h-4 w-4 text-primary" />
//                 </div>
//               </div>
//             )}

//             {/* Message Content */}
//             <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
//               <div className={message.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
//                 {message.imageUrl && (
//                   <img 
//                     src={message.imageUrl} 
//                     alt="Uploaded crop"
//                     className="w-full max-w-xs rounded-lg mb-2"
//                     onError={(e) => {
//                       // Handle image loading errors
//                       e.currentTarget.style.display = 'none';
//                     }}
//                   />
//                 )}
//                 <p className="whitespace-pre-line">{message.content}</p>
//               </div>
              
//               {/* Bot message feedback and audio controls */}
//               {message.type === 'bot' && (
//                 <div className="flex items-center gap-2 mt-2">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleFeedback(message.id, 'positive')}
//                     className={`h-6 w-6 p-0 ${message.feedback === 'positive' ? 'text-success' : 'text-muted-foreground'}`}
//                   >
//                     <ThumbsUp className="h-3 w-3" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleFeedback(message.id, 'negative')}
//                     className={`h-6 w-6 p-0 ${message.feedback === 'negative' ? 'text-destructive' : 'text-muted-foreground'}`}
//                   >
//                     <ThumbsDown className="h-3 w-3" />
//                   </Button>
                  
//                   {/* Text-to-Speech Controls */}
//                   {message.isPlaying ? (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => handleStopSpeaking(message.id)}
//                       className="h-6 w-6 p-0 text-muted-foreground"
//                       title="Stop speaking"
//                     >
//                       <VolumeX className="h-3 w-3" />
//                     </Button>
//                   ) : (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => handleSpeakMessage(message.id, message.content)}
//                       className="h-6 w-6 p-0 text-muted-foreground"
//                       title="Read aloud"
//                       disabled={isSpeaking !== null}
//                     >
//                       <Volume2 className="h-3 w-3" />
//                     </Button>
//                   )}
                  
//                   <span className="text-xs text-muted-foreground">
//                     {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* User Avatar */}
//             {message.type === 'user' && (
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
//                   <User className="h-4 w-4 text-primary-foreground" />
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}

//         {/* Loading Indicator */}
//         {isLoading && (
//           <div className="flex gap-3 justify-start">
//             <div className="flex-shrink-0">
//               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                 <Bot className="h-4 w-4 text-primary" />
//               </div>
//             </div>
//             <div className="chat-bubble-bot">
//               <div className="flex gap-1">
//                 <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
//                 <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
//                 <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
//               </div>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Quick Suggestions */}
//       <div className="p-4 border-t border-border">
//         <div className="flex gap-2 overflow-x-auto pb-2">
//           {quickSuggestions.map((suggestion, index) => (
//             <Button
//               key={index}
//               variant="outline"
//               size="sm"
//               className="whitespace-nowrap"
//               onClick={() => setInputMessage(suggestion)}
//             >
//               {suggestion}
//             </Button>
//           ))}
//         </div>
//       </div>

//       {/* Input Area */}
//       <div className="p-4 border-t border-border bg-card">
//         <div className="flex gap-2 items-end">
//           {/* Image Upload */}
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => fileInputRef.current?.click()}
//             className="flex-shrink-0"
//             disabled={isLoading}
//           >
//             <ImageIcon className="h-4 w-4" />
//           </Button>
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             onChange={handleImageUpload}
//             className="hidden"
//           />

//           {/* Voice Recording */}
//           <Button
//             variant={isRecording ? "destructive" : "outline"}
//             size="icon"
//             onClick={() => setIsRecording(!isRecording)}
//             className="flex-shrink-0"
//             disabled={isLoading}
//           >
//             {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
//           </Button>

//           {/* Text Input */}
//           <div className="flex-1">
//             <Input
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               placeholder="Ask me anything about farming..."
//               onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
//               className="min-h-12"
//               disabled={isLoading}
//             />
//           </div>

//           {/* Send Button */}
//           <Button
//             variant="chat"
//             size="icon"
//             onClick={handleSendMessage}
//             disabled={!inputMessage.trim() || isLoading}
//             className="flex-shrink-0"
//           >
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;



// Claude Code (3)

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Send, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  User, 
  Bot,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  Volume2,
  VolumeX,
  Plus,
  Search,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import aiAssistant from "@/assets/ai-assistant.png";
import { getGeminiResponse, validateImageData } from "@/services/gemini_service";
import "@/types/speech.d.ts";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  feedback?: 'positive' | 'negative';
  isPlaying?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

// Voice Recognition Manager - handles speech-to-text with auto-stop
class VoiceRecognitionManager {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private silenceTimer: NodeJS.Timeout | null = null;
  private onResultCallback: ((transcript: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    if (!this.isSupported()) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.setupRecognition();
  }

  private isSupported(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  private setupRecognition(): void {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.addEventListener('start', () => {
      this.isListening = true;
      console.log('Voice recognition started');
    });

    this.recognition.addEventListener('result', (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Reset silence timer when we get speech
      if (interimTranscript || finalTranscript) {
        this.resetSilenceTimer();
      }

      // If we have a final result, call the callback
      if (finalTranscript && this.onResultCallback) {
        this.onResultCallback(finalTranscript.trim());
        this.stop(); // Auto-stop after getting final result
      }
    });

    this.recognition.addEventListener('error', (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      
      let errorMessage = 'Speech recognition error occurred.';
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try speaking again.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone not accessible. Please check permissions.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please enable permissions.';
          break;
        case 'network':
          errorMessage = 'Network error occurred during speech recognition.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      
      if (this.onErrorCallback) {
        this.onErrorCallback(errorMessage);
      }
    });

    this.recognition.addEventListener('end', () => {
      this.isListening = false;
      this.clearSilenceTimer();
      console.log('Voice recognition ended');
      
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    });

    // Handle speech start and end for auto-stop functionality
    this.recognition.addEventListener('speechstart', () => {
      console.log('Speech detected');
      this.clearSilenceTimer();
    });

    this.recognition.addEventListener('speechend', () => {
      console.log('Speech ended, starting silence timer');
      this.startSilenceTimer();
    });
  }

  private startSilenceTimer(): void {
    this.clearSilenceTimer();
    // Auto-stop after 2 seconds of silence
    this.silenceTimer = setTimeout(() => {
      console.log('Silence detected, stopping recognition');
      this.stop();
    }, 2000);
  }

  private resetSilenceTimer(): void {
    this.clearSilenceTimer();
    this.startSilenceTimer();
  }

  private clearSilenceTimer(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  start(
    onResult: (transcript: string) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Already listening'));
        return;
      }

      this.onResultCallback = onResult;
      this.onErrorCallback = onError;
      this.onEndCallback = onEnd;

      try {
        this.recognition.start();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    this.clearSilenceTimer();
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }
}

// Audio utilities class for text-to-speech
class AudioManager {
  private voiceManager: VoiceRecognitionManager;

  constructor() {
    this.voiceManager = new VoiceRecognitionManager();
  }

  // Start voice recognition with auto-stop
  async startVoiceRecognition(
    onResult: (transcript: string) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): Promise<void> {
    return this.voiceManager.start(onResult, onError, onEnd);
  }

  // Stop voice recognition
  stopVoiceRecognition(): void {
    this.voiceManager.stop();
  }

  // Check if currently listening
  isListening(): boolean {
    return this.voiceManager.isCurrentlyListening();
  }

  // Text to speech
  speakText(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Text-to-speech not supported in this browser'));
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => resolve();
      utterance.onerror = (event: any) => reject(new Error(`Speech synthesis error: ${event.error}`));

      window.speechSynthesis.speak(utterance);
    });
  }

  stopSpeaking(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

const ChatInterface = () => {
  // Chat sessions and sidebar state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Farming Assistant Chat',
      lastMessage: 'Hello! I\'m your AI farming assistant...',
      timestamp: new Date(),
      messageCount: 1
    }
  ]);
  const [currentSessionId, setCurrentSessionId] = useState('1');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Messages and chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI farming assistant. I can help you with crop advice, disease identification, weather guidance, and market information. How can I assist you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioManager] = useState(() => new AudioManager());
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Voice recording functions with auto-stop
  const handleStartVoiceRecording = async () => {
    try {
      setIsRecording(true);
      
      await audioManager.startVoiceRecognition(
        // onResult callback - called when speech is recognized
        async (transcript: string) => {
          if (transcript.trim()) {
            setIsLoading(true);
            
            // Create user message with the transcribed text
            const userMessage: Message = {
              id: Date.now().toString(),
              type: 'user',
              content: transcript,
              timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, userMessage]);
            
            try {
              // Get AI response
              const response = await getGeminiResponse(transcript);
              
              const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: response,
                timestamp: new Date(),
              };
              
              setMessages(prev => [...prev, botResponse]);
              
              // Automatically speak the response
              setTimeout(() => {
                handleSpeakMessage(botResponse.id, response);
              }, 500);
            } catch (error: any) {
              console.error('Error getting AI response:', error);
              
              let errorContent = 'I\'m having trouble connecting right now. Please try again.';
              if (error.message?.includes('API key')) {
                errorContent = 'There seems to be a configuration issue. Please contact support.';
              } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
                errorContent = error.message;
              }
              
              const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: errorContent,
                timestamp: new Date(),
              };
              
              setMessages(prev => [...prev, errorMessage]);
            } finally {
              setIsLoading(false);
            }
          }
        },
        // onError callback
        (error: string) => {
          console.error('Voice recognition error:', error);
          const errorMessage: Message = {
            id: Date.now().toString(),
            type: 'bot',
            content: error,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, errorMessage]);
          setIsRecording(false);
        },
        // onEnd callback
        () => {
          setIsRecording(false);
        }
      );
    } catch (error: any) {
      console.error('Error starting voice recognition:', error);
      
      let errorContent = 'Could not start voice recognition. Please check your microphone permissions.';
      if (error.message?.includes('not supported')) {
        errorContent = 'Voice recognition is not supported in this browser. Please type your message instead.';
      }
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: errorContent,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsRecording(false);
    }
  };

  const handleStopVoiceRecording = () => {
    audioManager.stopVoiceRecognition();
    setIsRecording(false);
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      handleStopVoiceRecording();
    } else {
      handleStartVoiceRecording();
    }
  };

  // Text-to-speech functions
  const handleSpeakMessage = async (messageId: string, text: string) => {
    try {
      setIsSpeaking(messageId);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, isPlaying: true } : msg
        )
      );
      
      await audioManager.speakText(text);
    } catch (error) {
      console.error('Error speaking text:', error);
    } finally {
      setIsSpeaking(null);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, isPlaying: false } : msg
        )
      );
    }
  };

  const handleStopSpeaking = (messageId: string) => {
    audioManager.stopSpeaking();
    setIsSpeaking(null);
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isPlaying: false } : msg
      )
    );
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(currentInput);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error: any) {
      console.error('Error calling AI chat:', error);
      
      let errorContent = 'I\'m having trouble connecting right now. Please check your connection and try again.';
      
      if (error.message?.includes('API key')) {
        errorContent = 'There seems to be a configuration issue. Please contact support if this continues.';
      } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
        errorContent = error.message;
      } else if (error.message?.includes('safety') || error.message?.includes('blocked')) {
        errorContent = 'I couldn\'t process that request. Please try rephrasing your question in a different way.';
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: errorContent,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP).',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Image file is too large. Please upload an image smaller than 10MB.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      
      if (!validateImageData(imageData)) {
        const errorMessage: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: 'Invalid image format. Please try uploading a different image.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: 'I\'ve uploaded an image for crop disease analysis.',
        timestamp: new Date(),
        imageUrl,
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await getGeminiResponse(
          'Please analyze this crop image for diseases, pests, or other issues. Provide detailed insights about what you see and any recommendations for treatment or prevention.',
          imageData
        );

        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: response,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botResponse]);
      } catch (error: any) {
        console.error('Error analyzing image:', error);
        
        let errorContent = 'I\'m having trouble analyzing the image right now. Please try again later or describe the issue you\'re seeing with your crops.';
        
        if (error.message?.includes('Failed to analyze the image')) {
          errorContent = error.message;
        } else if (error.message?.includes('safety') || error.message?.includes('blocked')) {
          errorContent = 'The image couldn\'t be processed due to content restrictions. Please try a different image.';
        }
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: errorContent,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    
    reader.onerror = () => {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Failed to read the image file. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    };
    
    reader.readAsDataURL(file);
  };

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
  };

  // Chat session management
  const createNewChat = () => {
    const newSessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Chat',
      lastMessage: '',
      timestamp: new Date(),
      messageCount: 0
    };
    
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSessionId);
    setMessages([{
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI farming assistant. How can I help you today?',
      timestamp: new Date(),
    }]);
  };

  const filteredSessions = chatSessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickSuggestions = [
    "What crops are best for this season?",
    "How to identify pest problems?", 
    "Check weather forecast",
    "Current market prices",
    "Organic farming tips",
    "Irrigation schedule advice"
  ];

  return (
  <div className="flex h-screen bg-background">
    {/* Sidebar */}
    <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-border bg-muted/30`}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <Button
            onClick={createNewChat}
            className="w-full justify-start gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Chat Sessions */}
        <div className="flex-1 overflow-y-auto px-2">
          {filteredSessions.map((session) => (
            <Button
              key={session.id}
              variant={currentSessionId === session.id ? "secondary" : "ghost"}
              className="w-full justify-start p-3 mb-1 h-auto"
              onClick={() => setCurrentSessionId(session.id)}
            >
              <div className="flex flex-col items-start w-full">
                <div className="flex items-center gap-2 w-full">
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium truncate">{session.title}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 truncate w-full text-left">
                  {session.lastMessage || 'No messages yet'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {session.timestamp.toLocaleDateString()}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>

    {/* Main Chat Area */}
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={aiAssistant} alt="AI Assistant" className="w-10 h-10 rounded-full" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                  <Sparkles className="h-2 w-2 text-white" />
                </div>
              </div>
              <div>
                <h2 className="font-semibold text-lg">KrishiConnect AI</h2>
                <p className="text-sm text-muted-foreground">Smart Farming Assistant • Online</p>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {messages.length === 1 && messages[0].type === 'bot' && (
            /* Welcome Screen */
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="mb-8">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Welcome to KrishiConnect AI</h3>
                <p className="text-muted-foreground max-w-md">
                  Your intelligent farming companion. Ask me anything about crops, weather, market prices, or farming techniques.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {quickSuggestions.slice(0, 4).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="p-4 h-auto text-left justify-start"
                    onClick={() => setInputMessage(suggestion)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.length > 1 && (
            <div className="space-y-6 p-4">
              {messages.slice(1).map((message) => (
                <div key={message.id} className="group">
                  <div className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {/* Bot Avatar */}
                    {message.type === 'bot' && (
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    )}

                    {/* Message Content */}
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground ml-auto' 
                          : 'bg-muted'
                      }`}>
                        {message.imageUrl && (
                          <img 
                            src={message.imageUrl} 
                            alt="Uploaded"
                            className="w-full max-w-xs rounded-lg mb-2"
                          />
                        )}
                        <p className="whitespace-pre-line text-sm leading-relaxed">{message.content}</p>
                      </div>
                      
                      {/* Message Actions */}
                      <div className={`flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}>
                        {message.type === 'bot' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigator.clipboard.writeText(message.content)}
                              className="h-7 w-7 p-0"
                              title="Copy message"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFeedback(message.id, 'positive')}
                              className={`h-7 w-7 p-0 ${message.feedback === 'positive' ? 'text-green-600' : ''}`}
                              title="Good response"
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFeedback(message.id, 'negative')}
                              className={`h-7 w-7 p-0 ${message.feedback === 'negative' ? 'text-red-600' : ''}`}
                              title="Poor response"
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>

                            {message.isPlaying ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStopSpeaking(message.id)}
                                className="h-7 w-7 p-0"
                                title="Stop speaking"
                              >
                                <VolumeX className="h-3 w-3" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSpeakMessage(message.id, message.content)}
                                className="h-7 w-7 p-0"
                                title="Read aloud"
                                disabled={isSpeaking !== null}
                              >
                                <Volume2 className="h-3 w-3" />
                              </Button>
                            )}
                          </>
                        )}
                        
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* User Avatar */}
                    {message.type === 'user' && (
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-4">
          <div className="relative">
            <div className="flex items-end gap-2 bg-muted/50 rounded-2xl p-2">
              {/* Image Upload */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 h-10 w-10"
                disabled={isLoading || isRecording}
                title="Upload image"
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Text Input */}
              <div className="flex-1">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={isRecording ? "🎤 Recording..." : "Message KrishiConnect AI..."}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && !isLoading && !isRecording && handleSendMessage()}
                  className="border-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[40px] max-h-32"
                  disabled={isLoading || isRecording}
                />
              </div>

              {/* Voice Recording */}
              <Button
                variant={isRecording ? "destructive" : "ghost"}
                size="icon"
                onClick={handleToggleRecording}
                className={`flex-shrink-0 h-10 w-10 ${isRecording ? 'animate-pulse' : ''}`}
                disabled={isLoading}
                title={isRecording ? "Stop recording" : "Start voice recording"}
              >
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>

              {/* Send Button */}
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading || isRecording}
                className="flex-shrink-0 h-10 w-10 bg-primary hover:bg-primary/90"
                title="Send message"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Recording Status */}
            {isRecording && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs animate-pulse">
                  🔴 Recording... Click mic to stop
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions - only show when no messages */}
          {messages.length <= 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
              {quickSuggestions.slice(4).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap text-xs"
                  onClick={() => setInputMessage(suggestion)}
                  disabled={isLoading || isRecording}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}
export default ChatInterface