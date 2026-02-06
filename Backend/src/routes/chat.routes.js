const express = require('express');
const router = express.Router();
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// @desc    Chat with Gemini AI
// @route   POST /api/v1/chat/gemini
router.post('/gemini', async (req, res) => {
  try {
    const { messages, userMessage } = req.body;

    if (!GEMINI_API_KEY) {
      console.log('GEMINI_API_KEY not configured, using fallback responses');
      // Fallback to basic responses if no API key
      const fallbackResponse = generateFallbackResponse(userMessage);
      return res.status(200).json({
        success: true,
        response: fallbackResponse,
      });
    }

    // Get system instruction
    const systemInstruction = messages.find(m => m.role === 'system')?.content || '';
    
    // Format conversation history for Gemini
    const conversationParts = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

    // Add current user message
    conversationParts.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const requestBody = {
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: conversationParts,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
        topP: 0.9,
        topK: 40,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    console.log('Calling Gemini API...');
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 
      'I apologize, but I couldn\'t generate a response. Please try again.';

    console.log('Gemini response received successfully');

    res.status(200).json({
      success: true,
      response: generatedText,
    });
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    
    // More detailed error logging
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', JSON.stringify(error.response.data, null, 2));
    }
    
    // Fallback response on error
    const fallbackResponse = generateFallbackResponse(req.body.userMessage);
    res.status(200).json({
      success: true,
      response: fallbackResponse,
      fallback: true, // Indicate this is a fallback response
    });
  }
});

// Fallback responses when API is unavailable
function generateFallbackResponse(input) {
  const lowerInput = (input || '').toLowerCase();
  
  if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
    return "Hello! 👋 I'm TrustGuard Assistant, your AI helper for fraud protection. How can I help you stay safe today?";
  }
  
  if (lowerInput.includes('scam') || lowerInput.includes('fraud') || lowerInput.includes('suspicious')) {
    return "🚨 **Stay Safe from Scams!**\n\nIf you've received a suspicious message or call:\n\n1. **Don't click** any links\n2. **Don't send** any money\n3. **Don't share** personal info (PIN, passwords, OTPs)\n4. **Block** the sender\n5. **Report** it through our platform\n\nCommon scam signs:\n• Urgency/pressure to act fast\n• Requests for money or personal info\n• Too-good-to-be-true offers\n• Unknown senders claiming to be from banks/M-Pesa\n\nWould you like to report a scam?";
  }
  
  if (lowerInput.includes('mpesa') || lowerInput.includes('m-pesa') || lowerInput.includes('mobile money')) {
    return "📱 **M-Pesa Safety Tips**\n\nSafaricom and legitimate businesses will **NEVER**:\n• Ask for your M-Pesa PIN\n• Request you to send money to \"confirm\" a transaction\n• Ask you to dial codes like *483*...\n\n✅ **Safe Practices:**\n• Only use official M-Pesa menus\n• Verify Paybill/Till numbers before paying\n• Check our app to verify if a business is legitimate\n• Never share your PIN with anyone\n\nGot a suspicious M-Pesa message? Report it to us!";
  }
  
  if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('plan') || lowerInput.includes('subscription')) {
    return "💳 **Our Protection Plans**\n\n**Free Plan** - KES 0/month\n• 5 message scans per day\n• Basic threat detection\n• Community reports access\n\n**Premium Plan** - KES 499/month\n• Unlimited scans\n• Real-time call & SMS protection\n• Priority support\n• Auto-blocking features\n\n**Business Plan** - KES 4,999/month\n• Everything in Premium\n• Business verification badge\n• API access\n• Dedicated support\n\nVisit /pricing to upgrade! 🛡️";
  }
  
  if (lowerInput.includes('how') && (lowerInput.includes('work') || lowerInput.includes('use'))) {
    return "🔍 **How ScamAlert Works**\n\n1. **Forward** suspicious SMS messages to our service\n2. Our **AI analyzes** the message in real-time\n3. You get a **safety rating** back instantly\n4. Make **informed decisions** before responding\n\n**Additional Features:**\n• Caller ID for suspicious numbers\n• Community-reported scam database\n• Business verification checks\n• Real-time alerts for new threats\n\nIt works on any phone—no app download required! 📱";
  }
  
  if (lowerInput.includes('report') || lowerInput.includes('submit')) {
    return "📢 **Report a Scam**\n\nHelp protect others by reporting fraud:\n\n1. Go to **/report** in the app\n2. Select the type of scam (call, SMS, payment)\n3. Enter the scammer's phone number\n4. Add any relevant details\n5. Submit!\n\nYour report helps us:\n• Block scammers faster\n• Warn other users\n• Build our fraud database\n\nEvery report makes the community safer! 🤝";
  }
  
  if (lowerInput.includes('verify') || lowerInput.includes('business') || lowerInput.includes('legitimate') || lowerInput.includes('legit')) {
    return "✅ **Business Verification**\n\nBefore paying any business:\n\n1. Check their **Paybill/Till number** on our app\n2. Look for the **verified badge** ✓\n3. Read **community reviews**\n\n**For Business Owners:**\nGet verified to build customer trust!\n• Upload your registration certificate\n• Our AI verifies the document\n• Receive a verification badge\n\nVisit **/business-register** to get started! 🏢";
  }
  
  if (lowerInput.includes('help') || lowerInput.includes('support') || lowerInput.includes('contact')) {
    return "🆘 **Need Help?**\n\nI can help you with:\n\n• 🔍 **Identifying scams** - Tell me about suspicious messages\n• 📢 **Reporting fraud** - I'll guide you through the process\n• 💳 **Pricing & plans** - Compare our protection options\n• ✅ **Business verification** - Check if a business is legit\n• ⚙️ **How it works** - Learn about our features\n\nFor urgent support:\n• Email: support@scamalert.co.ke\n• Visit: /contact\n\nWhat would you like help with?";
  }
  
  // Default response
  return "👋 I'm TrustGuard Assistant, here to help keep you safe from fraud!\n\nI can help you with:\n\n• 🛡️ **Scam detection** - Ask about suspicious messages\n• 📢 **Report fraud** - File a scam report\n• 💳 **Plans & pricing** - View protection options\n• ✅ **Verify businesses** - Check if a business is legit\n• 📱 **M-Pesa safety** - Mobile money security tips\n\nWhat would you like to know? 🤔";
}

module.exports = router;
