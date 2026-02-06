import { Check, X, Zap, Crown, Shield } from "lucide-react";
 import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldIcon } from "@/components/icons/ShieldIcon";
import { Link } from "react-router-dom";
 import { MpesaPaymentModal } from "@/components/MpesaPaymentModal";
 import { useToast } from "@/hooks/use-toast";
import {Header} from "@/components/Header";

const pricingPlans = [
  {
    name: "Free",
    description: "Essential protection for individuals",
    price: "0",
    currency: "KES",
    period: "forever",
    icon: Shield,
    popular: false,
    features: [
      { text: "5 SMS scans per day", included: true },
      { text: "Basic fraud detection", included: true },
      { text: "Community reports access", included: true },
      { text: "Email support", included: true },
      { text: "Real-time alerts", included: false },
      { text: "Trusted contact alerts", included: false },
      { text: "Priority scanning", included: false },
      { text: "API access", included: false },
    ],
    cta: "Get Started Free",
    variant: "outline" as const,
  },
  {
    name: "Premium",
    description: "Advanced protection for power users",
    price: "499",
    currency: "KES",
    period: "per month",
    icon: Zap,
    popular: true,
    features: [
      { text: "Unlimited SMS scans", included: true },
      { text: "Advanced AI detection", included: true },
      { text: "Community reports access", included: true },
      { text: "Priority email & chat support", included: true },
      { text: "Real-time push alerts", included: true },
      { text: "Trusted contact alerts", included: true },
      { text: "Priority scanning queue", included: true },
      { text: "API access", included: false },
    ],
    cta: "Start Premium Trial",
    variant: "hero" as const,
  },
  {
    name: "Business",
    description: "Enterprise-grade protection",
    price: "4,999",
    currency: "KES",
    period: "per month",
    icon: Crown,
    popular: false,
    features: [
      { text: "Unlimited SMS scans", included: true },
      { text: "Enterprise AI models", included: true },
      { text: "Private fraud database", included: true },
      { text: "24/7 dedicated support", included: true },
      { text: "Real-time push alerts", included: true },
      { text: "Team management", included: true },
      { text: "Priority scanning queue", included: true },
      { text: "Full API access", included: true },
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
  },
];

const Pricing = () => {
   const [paymentModal, setPaymentModal] = useState<{ open: boolean; plan: string; amount: number } | null>(null);
   const { toast } = useToast();
 
   const handleSelectPlan = (plan: typeof pricingPlans[0]) => {
     if (plan.name === "Free") {
       // Redirect to signup for free plan
       window.location.href = "/signup";
       return;
     }
     
     if (plan.name === "Business") {
       // Contact sales for enterprise
       window.location.href = "/contact";
       return;
     }
     
     // Open M-Pesa payment for Premium
     setPaymentModal({
       open: true,
       plan: plan.name,
       amount: parseInt(plan.price.replace(/,/g, '')),
     });
   };
 
   const handlePaymentSuccess = () => {
     toast({
       title: "Subscription Active!",
       description: "Your premium features are now unlocked.",
     });
     setTimeout(() => {
       window.location.href = "/app";
     }, 2000);
   };
 
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
        <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Simple, Transparent Pricing</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
            Choose Your Protection Level
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From free essential protection to enterprise-grade security. 
            Start free and upgrade as your needs grow.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.name}
                className={`relative overflow-hidden ${
                  plan.popular 
                    ? "border-primary shadow-lg scale-105 z-10" 
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-primary py-1 text-center">
                    <span className="text-xs font-bold text-primary-foreground uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className={plan.popular ? "pt-10" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${plan.popular ? "bg-primary/20" : "bg-muted"}`}>
                      <plan.icon className={`w-6 h-6 ${plan.popular ? "text-primary" : "text-foreground"}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground">{plan.currency}</span>
                    <span className="text-4xl font-display font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-safe flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />
                        )}
                        <span className={feature.included ? "text-foreground" : "text-muted-foreground/50"}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                   <Button 
                     variant={plan.variant} 
                     className="w-full" 
                     size="lg"
                     onClick={(e) => {
                       e.preventDefault();
                       handleSelectPlan(plan);
                     }}
                   >
                      {plan.cta}
                    </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-background rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-lg mb-2">Can I switch plans anytime?</h3>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="bg-background rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-lg mb-2">Is my data secure?</h3>
              <p className="text-muted-foreground">
                Absolutely. We use bank-grade encryption and never store your personal financial information. 
                Your privacy is our priority.
              </p>
            </div>
            <div className="bg-background rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-lg mb-2">Do you support SMS alerts for basic phones?</h3>
              <p className="text-muted-foreground">
                Yes! Our SMS Gateway Service works with any phone that can receive text messages, 
                including basic feature phones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 TrustGuardUnit. All rights reserved.
          </p>
        </div>
      </footer>
 
       {/* M-Pesa Payment Modal */}
       {paymentModal && (
         <MpesaPaymentModal
           isOpen={paymentModal.open}
           onClose={() => setPaymentModal(null)}
           planName={paymentModal.plan}
           amount={paymentModal.amount}
           onSuccess={handlePaymentSuccess}
         />
       )}
    </div>
  );
};

export default Pricing;
