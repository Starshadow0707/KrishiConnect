import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false }
    });

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { question, imageData, language = 'en' } = await req.json();

    if (!question && !imageData) {
      throw new Error('Question or image data is required');
    }

    console.log('Processing chat request for user:', user.id);

    // Get farmer profile for context
    const { data: farmer } = await supabase
      .from('farmers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get recent weather data for farmer's district
    let weatherContext = '';
    if (farmer?.district) {
      const { data: weather } = await supabase
        .from('weather_data')
        .select('weather_data, agricultural_indices')
        .eq('district', farmer.district)
        .gte('expires_at', new Date().toISOString())
        .single();
      
      if (weather) {
        weatherContext = `Current weather in ${farmer.district}: ${JSON.stringify(weather.weather_data)}. Agricultural conditions: ${JSON.stringify(weather.agricultural_indices)}.`;
      }
    }

    // Build context-aware system prompt
    let systemPrompt = `You are KrishiConnect AI, an expert agricultural assistant for farmers in Kerala, India. You provide practical, actionable farming advice.

Context about the farmer:
- Name: ${farmer?.name || 'User'}
- District: ${farmer?.district || 'Not specified'}
- Farm size: ${farmer?.farm_size_acres || 'Not specified'} acres
- Primary crops: ${farmer?.primary_crops?.join(', ') || 'Not specified'}
- Soil type: ${farmer?.soil_type || 'Not specified'}
- Language: ${farmer?.preferred_language || language}

${weatherContext}

Guidelines:
- Provide specific, actionable advice
- Consider local Kerala farming conditions
- Include crop timing, weather patterns, and seasonal recommendations
- Mention specific fertilizers, pesticides, or treatments when relevant
- Be concise but comprehensive
- If asked about diseases, provide symptoms, causes, and treatments
- Include preventive measures when possible
- Respond in ${language === 'ml' ? 'Malayalam' : language === 'ta' ? 'Tamil' : language === 'te' ? 'Telugu' : language === 'kn' ? 'Kannada' : language === 'hi' ? 'Hindi' : 'English'}`;

    const startTime = Date.now();
    let geminiResponse;

    if (imageData) {
      // Image analysis for crop disease detection
      systemPrompt += `\n\nThe farmer has uploaded an image of their crop for disease/pest identification. Analyze the image and provide:
1. Crop identification if possible
2. Disease/pest identification
3. Severity assessment
4. Treatment recommendations
5. Preventive measures`;

      const imageAnalysisPayload = {
        contents: [{
          parts: [
            { text: systemPrompt + `\n\nQuestion: ${question || 'Please analyze this crop image for any diseases or issues.'}` },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageData.split(',')[1] // Remove data:image/jpeg;base64, prefix
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 32,
          topP: 1,
          maxOutputTokens: 1024,
        }
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(imageAnalysisPayload)
        }
      );

      const data = await response.json();
      geminiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to analyze the image. Please try again.';

    } else {
      // Text-based chat
      const chatPayload = {
        contents: [{
          parts: [{ text: systemPrompt + `\n\nFarmer's question: ${question}` }]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 1024,
        }
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(chatPayload)
        }
      );

      const data = await response.json();
      geminiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I could not process your question. Please try asking again.';
    }

    const responseTime = Date.now() - startTime;

    // Save the query to database if farmer profile exists
    if (farmer) {
      await supabase
        .from('chat_queries')
        .insert({
          farmer_id: farmer.id,
          question: question || 'Image analysis request',
          response: geminiResponse,
          language: language,
          has_image: !!imageData,
          response_time_ms: responseTime
        });
    }

    console.log('Chat response generated successfully in', responseTime, 'ms');

    return new Response(
      JSON.stringify({ 
        response: geminiResponse,
        responseTime: responseTime 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while processing your request',
        details: 'Please check your connection and try again.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});