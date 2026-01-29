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

const botResponses: { [key: string]: string } = {
  hello: "Hello! I'm TrustGuard Assistant. How can I help you stay safe from financial scams today?",
  hi: "Hi there! I'm here to help you with fraud protection. What would you like to know?",
  scam: "If you've received a suspicious message, here's what to do:\n\n1. Don't click any links\n2. Don't send any money\n3. Forward the message to our short code 20XXX\n4. Block the sender\n\nWould you like me to explain common scam patterns?",
  money: "Never send money to unknown accounts, even if the message claims to be from a financial institution. Legitimate organizations will never ask you to send money via SMS. Report such messages to us immediately.",
  "how does it work": "TrustGuardUnit works by analyzing SMS messages using AI:\n\n1. You forward suspicious messages to us\n2. Our AI analyzes the content in real-time\n3. We send you back a safety rating\n4. You make informed decisions\n\nIt works on any phone—no app required!",
  pricing: "We offer three plans:\n\n• Free: 5 scans/day, basic protection\n• Premium (KES 499/mo): Unlimited scans, real-time alerts\n• Business (KES 4,999/mo): Enterprise features, API access\n\nVisit our pricing page for more details!",
  safe: "To stay safe from financial fraud:\n\n✓ Never share PINs or passwords\n✓ Verify sender identity independently\n✓ Be suspicious of urgent requests\n✓ Use TrustGuardUnit to check messages\n✓ Report scams to help others",
  report: "To report a scam:\n\n1. Forward the message to 20XXX\n2. We'll analyze and log it\n3. Your report helps protect others\n\nYou can also report directly on our platform if you have an account.",
  default: "I'm here to help with fraud protection! You can ask me about:\n\n• How to identify scams\n• What to do if you receive suspicious messages\n• How TrustGuardUnit works\n• Pricing and plans\n• How to report fraud\n\nWhat would you like to know?",
};

const findResponse = (input: string): string => {
  const lowerInput = input.toLowerCase();
  
  for (const [key, response] of Object.entries(botResponses)) {
    if (key !== "default" && lowerInput.includes(key)) {
      return response;
    }
  }
  
  return botResponses.default;
};

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: findResponse(input),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
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
