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
  Camera,
  Upload
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import aiAssistant from "@/assets/ai-assistant.png";
import { getGeminiResponse, validateImageData } from "@/services/gemini_service";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  feedback?: 'positive' | 'negative';
}

const ChatInterface = () => {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

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
      
      // Provide more helpful error messages based on the error type
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

    // Validate file type
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

    // Check file size (limit to 10MB)
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
      
      // Validate the image data format
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
        // Clean up the file input
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

  const quickSuggestions = [
    "What crops are best for this season?",
    "How to identify pest problems?",
    "Check weather forecast",
    "Current market prices",
    "Organic farming tips",
    "Irrigation schedule advice"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="bg-card border-b border-border p-4 flex items-center gap-3">
        <img src={aiAssistant} alt="AI Assistant" className="w-10 h-10 rounded-full" />
        <div>
          <h2 className="font-semibold text-lg">AI Farming Assistant</h2>
          <p className="text-sm text-muted-foreground">Online • Multilingual Support</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* Bot Avatar */}
            {message.type === 'bot' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              </div>
            )}

            {/* Message Content */}
            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
              <div className={message.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                {message.imageUrl && (
                  <img 
                    src={message.imageUrl} 
                    alt="Uploaded crop"
                    className="w-full max-w-xs rounded-lg mb-2"
                    onError={(e) => {
                      // Handle image loading errors
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <p className="whitespace-pre-line">{message.content}</p>
              </div>
              
              {/* Bot message feedback */}
              {message.type === 'bot' && (
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeedback(message.id, 'positive')}
                    className={`h-6 w-6 p-0 ${message.feedback === 'positive' ? 'text-success' : 'text-muted-foreground'}`}
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeedback(message.id, 'negative')}
                    className={`h-6 w-6 p-0 ${message.feedback === 'negative' ? 'text-destructive' : 'text-muted-foreground'}`}
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>

            {/* User Avatar */}
            {message.type === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="chat-bubble-bot">
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

      {/* Quick Suggestions */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickSuggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setInputMessage(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2 items-end">
          {/* Image Upload */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0"
            disabled={isLoading}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Voice Recording */}
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="icon"
            onClick={() => setIsRecording(!isRecording)}
            className="flex-shrink-0"
            disabled={isLoading}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          {/* Text Input */}
          <div className="flex-1">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about farming..."
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              className="min-h-12"
              disabled={isLoading}
            />
          </div>

          {/* Send Button */}
          <Button
            variant="chat"
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;



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






// CHATGPT CODE (1)

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
//   Volume2,
//   VolumeX
// } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
// import aiAssistant from "@/assets/ai-assistant.png";
// import { getGeminiResponse, validateImageData } from "@/services/gemini_service";
// // 👇 NOTE: no import for speech.d.ts is required, just ensure it's in tsconfig.json "include"

// interface Message {
//   id: string;
//   type: 'user' | 'bot';
//   content: string;
//   timestamp: Date;
//   imageUrl?: string;
//   feedback?: 'positive' | 'negative';
//   isPlaying?: boolean;
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
//   const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const recognitionRef = useRef<SpeechRecognition | null>(null);

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

//   const handleStartRecording = () => {
//     try {
//       const SpeechRecognition =
//         window.SpeechRecognition || window.webkitSpeechRecognition;

//       if (!SpeechRecognition) {
//         console.error("Speech Recognition API not supported in this browser.");
//         return;
//       }

//       const recognition = new SpeechRecognition();
//       recognition.lang = "en-US";
//       recognition.continuous = false;
//       recognition.interimResults = true;

//       recognition.onresult = (event: SpeechRecognitionEvent) => {
//         const transcript = Array.from(event.results)
//           .map(result => result[0].transcript)
//           .join("");
//         setInputMessage(transcript);
//       };

//       recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
//         console.error("Speech recognition error:", event.error);
//         setIsRecording(false);
//       };

//       recognition.onend = () => {
//         setIsRecording(false);
//       };

//       recognition.start();
//       recognitionRef.current = recognition;
//       setIsRecording(true);
//     } catch (err) {
//       console.error("Speech recognition failed to start:", err);
//     }
//   };

//   const handleStopRecording = () => {
//     recognitionRef.current?.stop();
//     setIsRecording(false);
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
//             {message.type === 'bot' && (
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                   <Bot className="h-4 w-4 text-primary" />
//                 </div>
//               </div>
//             )}

//             <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
//               <div className={message.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
//                 {message.imageUrl && (
//                   <img 
//                     src={message.imageUrl} 
//                     alt="Uploaded crop"
//                     className="w-full max-w-xs rounded-lg mb-2"
//                     onError={(e) => {
//                       e.currentTarget.style.display = 'none';
//                     }}
//                   />
//                 )}
//                 <p className="whitespace-pre-line">{message.content}</p>
//               </div>
              
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
//                 </div>
//               )}
//             </div>

//             {message.type === 'user' && (
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
//                   <User className="h-4 w-4 text-primary-foreground" />
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}

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
//             onChange={() => {}}
//             className="hidden"
//           />

//           {/* Voice Recording */}
//           <Button
//             variant={isRecording ? "destructive" : "outline"}
//             size="icon"
//             onClick={isRecording ? handleStopRecording : handleStartRecording}
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