 # WhatsApp Integration with WPPConnect
 
 This document describes how to set up the WhatsApp integration as a **separate microservice** for TrustGuardUnit.
 
 ## Overview
 
 The WhatsApp integration uses [WPPConnect](https://github.com/wppconnect-team/wppconnect) to monitor outgoing messages and analyze them for potential impersonation or fraud.
 
 ## Architecture
 
 ```
 ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
 │   WhatsApp Web      │────▶│  WPPConnect Service │────▶│  AI Analysis API    │
 │   (Your Session)    │     │  (Node.js)          │     │  (HuggingFace)      │
 └─────────────────────┘     └─────────────────────┘     └─────────────────────┘
                                      │
                                      ▼
                              ┌─────────────────────┐
                              │  Warning Messages   │
                              │  (If Suspicious)    │
                              └─────────────────────┘
 ```
 
 ## Prerequisites
 
 - Node.js 16+ installed
 - Chrome/Chromium browser
 - WhatsApp account
 
 ## Setup Instructions
 
 ### 1. Create a new directory for the WhatsApp service
 
 ```bash
 mkdir whatsapp-guard
 cd whatsapp-guard
 npm init -y
 ```
 
 ### 2. Install dependencies
 
 ```bash
 npm install @wppconnect-team/wppconnect axios dotenv
 ```
 
 ### 3. Create the service file
 
 Create `index.js`:
 
 ```javascript
 const wppconnect = require('@wppconnect-team/wppconnect');
 const axios = require('axios');
 require('dotenv').config();
 
 const MY_NUMBER = process.env.MY_PHONE_NUMBER || "+254708762945";
 const AI_API_URL = process.env.AI_API_URL || "https://ST-THOMAS-OF-AQUINAS-DNAtextAnalysis2.hf.space/predict";
 const THRESHOLD = parseFloat(process.env.IMPERSONATION_THRESHOLD) || 0.020;
 
 // Invisible marker to prevent response loops
 const INVISIBLE_MARKER = "\u200B";
 
 wppconnect.create({
   session: 'trustguard-session',
   headless: true,
   useChrome: false,
   debug: false,
   logQR: true, // Show QR code in terminal
 }).then(client => start(client))
   .catch(err => console.error("❌ Failed to start WPPConnect:", err));
 
 function start(client) {
   console.log("✅ WhatsApp Guard active. Monitoring messages...");
 
   client.onAnyMessage(async (message) => {
     try {
       // Only handle outgoing private messages
       if (!message.fromMe || message.type !== "chat") return;
       if (!message.to.endsWith("@c.us")) return;
 
       const recipient = message.to.replace("@c.us", "");
       const text = message.body?.trim();
       if (!text) return;
 
       // Skip if this is an AI-generated reply (has invisible marker)
       if (text.startsWith(INVISIBLE_MARKER)) {
         console.log("⏩ Skipped AI reply to prevent loop.");
         return;
       }
 
       console.log(`📤 Outgoing: [${recipient}] ${text.substring(0, 50)}...`);
 
       // Analyze message with AI
       const response = await axios.get(AI_API_URL, {
         params: { text },
         timeout: 10000,
       });
 
       const score = parseFloat(response.data.impersonation_score || 0);
       console.log(`📊 Impersonation score: ${score}`);
 
       if (score > THRESHOLD) {
         const warning = "⚠️ TrustGuard Alert: This message differs significantly from the sender's usual writing style. Consider verifying via call.";
 
         // Send warning to recipient
         if (recipient !== MY_NUMBER.replace("+", "")) {
           await client.sendText(`${recipient}@c.us`, `${INVISIBLE_MARKER}${warning}`);
           console.log(`🚨 Warning sent to ${recipient}`);
         }
       }
     } catch (err) {
       console.error("❌ Error:", err.message);
     }
   });
 }
 ```
 
 ### 4. Create environment file
 
 Create `.env`:
 
 ```env
 MY_PHONE_NUMBER=+254708762945
 AI_API_URL=https://ST-THOMAS-OF-AQUINAS-DNAtextAnalysis2.hf.space/predict
 IMPERSONATION_THRESHOLD=0.020
 ```
 
 ### 5. Run the service
 
 ```bash
 node index.js
 ```
 
 A QR code will appear in the terminal. Scan it with WhatsApp to link.
 
 ## Production Deployment
 
 For production, consider:
 
 1. **Use PM2 for process management**:
    ```bash
    npm install -g pm2
    pm2 start index.js --name whatsapp-guard
    pm2 save
    pm2 startup
    ```
 
 2. **Docker deployment**:
    ```dockerfile
    FROM node:18-slim
    RUN apt-get update && apt-get install -y chromium
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    CMD ["node", "index.js"]
    ```
 
 3. **Session persistence**: WPPConnect stores session data in `tokens/` folder. Mount this as a volume in Docker.
 
 ## Phone Call Detection (Future Enhancement)
 
 For detecting phishing phone calls, integrate with:
 
 - **Google Cloud Speech-to-Text** for call transcription
 - **Twilio** for call interception
 - **TrustGuardUnit API** for fraud analysis
 
 Example flow:
 1. User enables call forwarding to TrustGuard number
 2. Calls are answered and recorded (with consent)
 3. Audio is transcribed in real-time
 4. AI analyzes transcript for fraud patterns
 5. User receives SMS alert if suspicious
 
 ## Security Notes
 
 - This service has access to all your WhatsApp messages
 - Run on a secure, private server
 - Never expose the tokens folder
 - Consider end-to-end encryption for message storage
 
 ## Support
 
 For help with integration, contact: support@trustguardunit.com