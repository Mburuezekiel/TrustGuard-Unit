import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldIcon } from "./icons/ShieldIcon";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

 const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
 const MAX_HISTORY = 10;
 
 const SYSTEM_PROMPT = `You are TrustGuard Assistant, an AI assistant for TrustGuardUnit - a fraud detection platform.
 Your role is to help users stay safe from financial scams, phishing, and fraud.
 
 Key topics you can help with:
 - How to identify scam messages and calls
 - What to do when receiving suspicious messages
 - How TrustGuardUnit works (AI-powered SMS/call analysis)
 - Pricing plans (Free, Premium KES 499/mo, Business KES 4,999/mo)
 - Reporting scams through our platform
 - General security best practices
 
 Be friendly, helpful, and concise. Use emojis occasionally. If asked about topics outside fraud protection, politely redirect to your expertise area.`;

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm TrustGuard Assistant. How can I help you stay safe from financial scams today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
   const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([
     { role: "system", content: SYSTEM_PROMPT },
   ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

   const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
     
     // Update conversation history with user message
     const updatedHistory = [
       ...conversationHistory,
       { role: "user", content: input },
     ].slice(-MAX_HISTORY - 1); // Keep last 10 exchanges + system prompt
     setConversationHistory(updatedHistory);
     
    setInput("");
    setIsTyping(true);

     try {
       // Call Gemini API through backend
       const response = await fetch(`${API_BASE_URL}/chat/gemini`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ 
           messages: updatedHistory,
           userMessage: input,
         }),
       });
 
       let botResponse = "I'm sorry, I couldn't process that request. Please try again.";
       
       if (response.ok) {
         const data = await response.json();
         botResponse = data.response || data.text || botResponse;
         
         // Update conversation history with assistant response
         setConversationHistory(prev => [
           ...prev,
           { role: "assistant", content: botResponse },
         ].slice(-MAX_HISTORY - 1));
       }
 
      const botMessage: Message = {
        id: Date.now() + 1,
         text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
     } catch (error) {
       console.error('Chatbot error:', error);
       const errorMessage: Message = {
         id: Date.now() + 1,
         text: "I'm having trouble connecting. Please try again in a moment.",
         sender: "bot",
         timestamp: new Date(),
       };
       setMessages((prev) => [...prev, errorMessage]);
     } finally {
       setIsTyping(false);
     }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)]"
          >
            <Card className="shadow-2xl border-border overflow-hidden">
              {/* Header */}
              <CardHeader className="bg-primary text-primary-foreground p-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldIcon className="w-6 h-6" variant="safe" />
                  TrustGuard Assistant
                </CardTitle>
                <p className="text-sm text-primary-foreground/80">
                  Ask me about fraud protection
                </p>
              </CardHeader>

              {/* Messages */}
              <CardContent className="p-0">
                <div className="h-80 overflow-y-auto p-4 space-y-4 bg-muted/30">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${
                        message.sender === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent text-accent-foreground"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      <div
                        className={`max-w-[75%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-background border border-border rounded-bl-none"
                        }`}
                      >
                        {message.text}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-background border border-border rounded-2xl rounded-bl-none p-3">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border bg-background">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button onClick={handleSend} size="icon" disabled={!input.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
