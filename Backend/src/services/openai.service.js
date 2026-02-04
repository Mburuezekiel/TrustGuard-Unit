const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyze SMS message for fraud using GPT-4.1
 */
const analyzeMessage = async (message, senderNumber) => {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are ScamAlert AI, an expert fraud detection system. Analyze messages for scam indicators including:
            - Urgency tactics ("Act now!", "Limited time")
            - Financial requests (PIN, password, transfer money)
            - Impersonation (banks, government, tech companies)
            - Suspicious links or phone numbers
            - Lottery/prize scams
            - Phishing attempts
            - Social engineering tactics
            
            Respond in JSON format with:
            {
              "riskScore": 0-100,
              "threatLevel": "safe" | "low" | "medium" | "high" | "critical",
              "category": "phishing" | "impersonation" | "financial_fraud" | "lottery_scam" | "tech_support" | "romance_scam" | "safe",
              "indicators": ["list of detected red flags"],
              "explanation": "Brief user-friendly explanation",
              "recommendation": "What the user should do",
              "confidence": 0-100
            }`
        },
        {
          role: 'user',
          content: `Analyze this message from ${senderNumber}:\n\n"${message}"`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 500
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    return {
      ...analysis,
      model: response.model,
      analyzedAt: new Date()
    };
  } catch (error) {
    console.error('OpenAI Analysis Error:', error);
    throw new Error('Failed to analyze message');
  }
};

/**
 * Classify intent of a message (mini model for faster processing)
 */
const classifyIntent = async (message) => {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL_MINI || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `Quickly classify this message intent. Respond with JSON:
            {
              "intent": "spam" | "scam" | "legitimate" | "unknown",
              "confidence": 0-100,
              "quickFlags": ["list of immediate red flags if any"]
            }`
        },
        {
          role: 'user',
          content: message
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 150
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Intent Classification Error:', error);
    return { intent: 'unknown', confidence: 0, quickFlags: [] };
  }
};

/**
 * Generate risk score for a phone number based on history
 */
const scorePhoneNumber = async (phoneNumber, reportHistory) => {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL_MINI || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a fraud risk scoring system. Based on the report history, calculate a risk score.
            Respond in JSON:
            {
              "riskScore": 0-100 (higher = more dangerous),
              "threatLevel": "safe" | "low" | "medium" | "high" | "critical",
              "summary": "One sentence summary",
              "shouldBlock": boolean
            }`
        },
        {
          role: 'user',
          content: `Phone number: ${phoneNumber}\n\nReport history:\n${JSON.stringify(reportHistory, null, 2)}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 200
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Phone Scoring Error:', error);
    throw new Error('Failed to score phone number');
  }
};

module.exports = {
  analyzeMessage,
  classifyIntent,
  scorePhoneNumber
};
