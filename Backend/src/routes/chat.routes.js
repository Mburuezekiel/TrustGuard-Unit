 const express = require('express');
 const router = express.Router();
 const axios = require('axios');
 
 const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
 const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
 
 // @desc    Chat with Gemini AI
 // @route   POST /api/v1/chat/gemini
 router.post('/gemini', async (req, res) => {
   try {
     const { messages, userMessage } = req.body;
 
     if (!GEMINI_API_KEY) {
       // Fallback to basic responses if no API key
       const fallbackResponse = generateFallbackResponse(userMessage);
       return res.status(200).json({
         success: true,
         response: fallbackResponse,
       });
     }
 
     // Format messages for Gemini
     const formattedMessages = messages.map(msg => ({
       role: msg.role === 'assistant' ? 'model' : msg.role,
       parts: [{ text: msg.content }],
     })).filter(msg => msg.role !== 'system');
 
     // Add system instruction as context
     const systemInstruction = messages.find(m => m.role === 'system')?.content || '';
 
     const response = await axios.post(
       `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
       {
         contents: [
           {
             role: 'user',
             parts: [{ text: `Context: ${systemInstruction}\n\nUser: ${userMessage}` }],
           },
           ...formattedMessages.slice(-8), // Last 8 messages for context
         ],
         generationConfig: {
           temperature: 0.7,
           maxOutputTokens: 500,
           topP: 0.9,
         },
         safetySettings: [
           { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
           { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
           { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
           { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
         ],
       },
       {
         headers: {
           'Content-Type': 'application/json',
         },
       }
     );
 
     const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 
       'I apologize, but I couldn\'t generate a response. Please try again.';
 
     res.status(200).json({
       success: true,
       response: generatedText,
     });
   } catch (error) {
     console.error('Gemini API Error:', error.response?.data || error.message);
     
     // Fallback response on error
     const fallbackResponse = generateFallbackResponse(req.body.userMessage);
     res.status(200).json({
       success: true,
       response: fallbackResponse,
     });
   }
 });
 
 // Fallback responses when API is unavailable
 function generateFallbackResponse(input) {
   const lowerInput = (input || '').toLowerCase();
   
   if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
     return "Hello! I'm TrustGuard Assistant. How can I help you stay safe from financial scams today? 🛡️";
   }
   
   if (lowerInput.includes('scam') || lowerInput.includes('fraud')) {
     return "If you've received a suspicious message, here's what to do:\n\n1. Don't click any links\n2. Don't send any money\n3. Forward the message to our analysis service\n4. Block the sender\n\nWould you like me to explain common scam patterns?";
   }
   
   if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('plan')) {
     return "We offer three plans:\n\n• Free: 5 scans/day, basic protection\n• Premium (KES 499/mo): Unlimited scans, real-time alerts\n• Business (KES 4,999/mo): Enterprise features, API access\n\nVisit our pricing page for more details! 💳";
   }
   
   if (lowerInput.includes('how') && lowerInput.includes('work')) {
     return "TrustGuardUnit works by analyzing SMS messages using AI:\n\n1. You forward suspicious messages to us\n2. Our AI analyzes the content in real-time\n3. We send you back a safety rating\n4. You make informed decisions\n\nIt works on any phone—no app required! 📱";
   }
   
   if (lowerInput.includes('report')) {
     return "To report a scam:\n\n1. Forward the message to our service\n2. We'll analyze and log it\n3. Your report helps protect others\n\nYou can also report directly on our platform if you have an account. 📢";
   }
   
   return "I'm here to help with fraud protection! You can ask me about:\n\n• How to identify scams\n• What to do if you receive suspicious messages\n• How TrustGuardUnit works\n• Pricing and plans\n• How to report fraud\n\nWhat would you like to know? 🤔";
 }
 
 module.exports = router;