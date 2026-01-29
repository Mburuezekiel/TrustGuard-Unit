import { useState } from "react";
import { ShieldIcon } from "./icons/ShieldIcon";
import { Button } from "./ui/button";
import { AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react";

type ThreatLevel = "safe" | "warning" | "danger" | null;

interface AnalysisResult {
  level: ThreatLevel;
  score: number;
  reasons: string[];
  advice: string;
}

const sampleMessages = [
  {
    label: "Scam Message",
    text: "MPESA: You have received Ksh 50,000 from unknown sender. To confirm, send your PIN to 0700123456 immediately or funds will be reversed.",
  },
  {
    label: "Legitimate Message",
    text: "LNM2G5YV8R Confirmed. Ksh500.00 sent to John Kamau 0712345678 on 28/1/25 at 2:30 PM. New M-PESA balance is Ksh1,234.56.",
  },
  {
    label: "Suspicious Message",
    text: "Congratulations! You won Ksh 100,000 in Safaricom promotion. Click link to claim: www.safar1com-win.com/claim",
  },
];

const analyzeMessage = (message: string): AnalysisResult => {
  const lowerMsg = message.toLowerCase();
  
  // Danger indicators
  const dangerPatterns = [
    { pattern: /send.*pin/i, reason: "Requests PIN sharing - legitimate services never ask for your PIN" },
    { pattern: /click.*link|www\.|http/i, reason: "Contains suspicious link that could be phishing" },
    { pattern: /immediately|urgent|now/i, reason: "Uses urgency tactics to pressure quick action" },
    { pattern: /won|winner|congratulations.*ksh/i, reason: "Fake lottery/promotion scam pattern detected" },
    { pattern: /unknown sender/i, reason: "Claims money from unknown source - classic scam tactic" },
    { pattern: /reversed|expire|blocked/i, reason: "Threatens account action to create fear" },
  ];

  // Safe indicators
  const safePatterns = [
    { pattern: /^[A-Z0-9]{10}\s+Confirmed/i, reason: "Valid M-PESA transaction ID format" },
    { pattern: /New M-PESA balance/i, reason: "Standard M-PESA confirmation format" },
    { pattern: /sent to [A-Z][a-z]+ [A-Z][a-z]+/i, reason: "Contains proper recipient name format" },
  ];

  const foundDangers = dangerPatterns.filter(p => p.pattern.test(message));
  const foundSafe = safePatterns.filter(p => p.pattern.test(message));

  if (foundDangers.length >= 2) {
    return {
      level: "danger",
      score: Math.min(95, 60 + foundDangers.length * 15),
      reasons: foundDangers.map(d => d.reason),
      advice: "DO NOT respond to this message. Do not share any personal information or click any links. Report to Safaricom by forwarding to 333.",
    };
  } else if (foundDangers.length === 1) {
    return {
      level: "warning",
      score: 45 + foundDangers.length * 20,
      reasons: foundDangers.map(d => d.reason),
      advice: "Be cautious with this message. Verify sender through official M-PESA channels before taking action.",
    };
  } else if (foundSafe.length >= 2) {
    return {
      level: "safe",
      score: 15,
      reasons: foundSafe.map(s => s.reason),
      advice: "This appears to be a legitimate M-PESA confirmation message.",
    };
  }
  
  return {
    level: "warning",
    score: 50,
    reasons: ["Unable to fully verify message authenticity"],
    advice: "When in doubt, contact Safaricom directly through official channels.",
  };
};

export const SMSDemo = () => {
  const [message, setMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!message.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const analysisResult = analyzeMessage(message);
    setResult(analysisResult);
    setIsAnalyzing(false);
  };

  const loadSample = (text: string) => {
    setMessage(text);
    setResult(null);
  };

  const getResultStyles = (level: ThreatLevel) => {
    switch (level) {
      case "safe":
        return {
          bg: "bg-safe/10 border-safe/30",
          icon: CheckCircle,
          iconColor: "text-safe",
          title: "Message Appears Safe",
          titleColor: "text-safe",
        };
      case "warning":
        return {
          bg: "bg-warning/10 border-warning/30",
          icon: AlertTriangle,
          iconColor: "text-warning",
          title: "Suspicious Message",
          titleColor: "text-warning",
        };
      case "danger":
        return {
          bg: "bg-danger/10 border-danger/30",
          icon: XCircle,
          iconColor: "text-danger",
          title: "High Risk - Likely Scam",
          titleColor: "text-danger",
        };
      default:
        return null;
    }
  };

  const resultStyles = result ? getResultStyles(result.level) : null;

  return (
    <section id="demo" className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Try It Now
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Test Our Fraud Detection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Paste any suspicious SMS message to see how TrustGuard AI analyzes it
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Sample messages */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Try a sample:</span>
            {sampleMessages.map((sample) => (
              <button
                key={sample.label}
                onClick={() => loadSample(sample.text)}
                className="text-sm px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
              >
                {sample.label}
              </button>
            ))}
          </div>

          {/* Input area */}
          <div className="relative mb-6">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste a suspicious SMS message here..."
              className="w-full h-40 p-4 rounded-2xl bg-card border-2 border-border focus:border-primary focus:outline-none resize-none text-foreground placeholder:text-muted-foreground transition-colors"
            />
            <div className="absolute bottom-4 right-4">
              <Button
                onClick={handleAnalyze}
                disabled={!message.trim() || isAnalyzing}
                variant="default"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ShieldIcon className="w-4 h-4" variant="default" />
                    Analyze Message
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Analysis Result */}
          {isAnalyzing && (
            <div className="p-8 rounded-2xl border-2 border-border bg-card animate-pulse">
              <div className="flex items-center justify-center gap-4">
                <div className="relative">
                  <ShieldIcon className="w-12 h-12 text-primary animate-shield-pulse" />
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                </div>
                <div>
                  <p className="font-display font-bold text-lg text-foreground">Analyzing Message...</p>
                  <p className="text-sm text-muted-foreground">Checking for fraud patterns</p>
                </div>
              </div>
            </div>
          )}

          {result && resultStyles && (
            <div className={`p-6 rounded-2xl border-2 ${resultStyles.bg} animate-scale-in`}>
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-card">
                  <resultStyles.icon className={`w-8 h-8 ${resultStyles.iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-display font-bold text-xl ${resultStyles.titleColor}`}>
                      {resultStyles.title}
                    </h3>
                    <span className={`text-sm font-bold ${resultStyles.titleColor}`}>
                      Risk Score: {result.score}%
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {result.reasons.map((reason, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${resultStyles.iconColor} bg-current`} />
                        <span className="text-sm text-foreground">{reason}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-card/80">
                    <p className="text-sm font-medium text-foreground mb-1">Recommended Action:</p>
                    <p className="text-sm text-muted-foreground">{result.advice}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
