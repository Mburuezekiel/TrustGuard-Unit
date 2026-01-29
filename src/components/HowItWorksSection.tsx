import { MessageSquare, Brain, Bell } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Receive SMS",
    description: "When you receive a suspicious SMS about M-PESA or money, TrustGuard Unit automatically starts analyzing.",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Analysis",
    description: "Our AI examines the message for fraud patterns: urgency tactics, impersonation, suspicious links, and known scam templates.",
  },
  {
    number: "03",
    icon: Bell,
    title: "Instant Alert",
    description: "Within seconds, you receive a color-coded warning with a clear explanation of the risk and what to do next.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-safe via-warning to-danger opacity-50" />
      
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            Simple Protection
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            How TrustGuard Unit Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Protection happens automatically in three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-safe via-warning to-primary -translate-y-1/2 z-0" />
          
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative"
              >
                <div className="bg-card rounded-2xl p-8 border border-border shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  {/* Step number badge */}
                  <div className="absolute -top-4 left-8 px-3 py-1 bg-primary rounded-full">
                    <span className="font-display font-bold text-sm text-primary-foreground">
                      {step.number}
                    </span>
                  </div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 mt-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
