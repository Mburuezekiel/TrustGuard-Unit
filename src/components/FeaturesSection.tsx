import { ShieldIcon } from "./icons/ShieldIcon";
import { 
  Zap, 
  Brain, 
  Users, 
  Lock, 
  MessageSquare, 
  Globe 
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-Time Detection",
    description: "Analyze incoming SMS messages instantly and receive alerts before you act on suspicious messages.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Brain,
    title: "Explainable AI Alerts",
    description: "Understand why a message is flagged with clear, simple explanations that help you learn to spot scams.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "Community Intelligence",
    description: "Benefit from collective fraud reports that strengthen protection for all financial service users.",
    color: "bg-safe/10 text-safe",
  },
  {
    icon: Lock,
    title: "Privacy-First Security",
    description: "Your messages are analyzed locally first. We never store your personal financial information.",
    color: "bg-foreground/10 text-foreground",
  },
  {
    icon: MessageSquare,
    title: "Trusted Contact Alerts",
    description: "Optionally notify family members when you receive high-risk messages for extra protection.",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: Globe,
    title: "Regional Intelligence",
    description: "Trained on local scam patterns, regional languages, and financial institution-specific fraud tactics.",
    color: "bg-danger/10 text-danger",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
            <ShieldIcon className="w-4 h-4" variant="safe" />
            <span className="text-sm font-medium text-primary">Powerful Protection</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Built for Financial Service Users
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive fraud detection designed specifically for mobile money and financial institutions.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} mb-4 transition-transform group-hover:scale-110`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
