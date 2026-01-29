import { ShieldIcon } from "./icons/ShieldIcon";
import { Button } from "./ui/button";

export const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-foreground/10 mb-8">
            <ShieldIcon className="w-10 h-10 text-primary-foreground" variant="safe" />
          </div>
          
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Protect Your Mobile Money Today
          </h2>
          
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto">
            Join over 100,000 Kenyans who trust TrustGuard Unit to keep their M-PESA safe from scammers. Free to start, powerful protection from day one.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl">
              Get Protected Free
            </Button>
            <Button variant="heroOutline" size="xl">
              Contact Sales
            </Button>
          </div>

          <p className="mt-8 text-sm text-primary-foreground/60">
            No credit card required • Works with all mobile networks • Privacy first
          </p>
        </div>
      </div>
    </section>
  );
};
