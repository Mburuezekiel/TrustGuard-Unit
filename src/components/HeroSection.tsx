import { ShieldIcon } from "./icons/ShieldIcon";
import { Button } from "./ui/button";
import { Shield, Zap, Users } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary-foreground/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary-foreground/5 rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 backdrop-blur-sm mb-8 animate-fade-in">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-safe opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-safe"></span>
            </span>
            <span className="text-sm text-primary-foreground/90 font-medium">
              Protecting 100,000+ Kenyans from mobile money fraud
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Real-Time Protection for
            <span className="block mt-2 bg-gradient-to-r from-accent to-yellow-300 bg-clip-text text-transparent">
              Kenya's Mobile Money
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            AI-powered fraud detection that analyzes SMS messages instantly, alerts you before you act, and educates you to stay safe. Built for M-PESA users.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl">
              Start Free Protection
            </Button>
            <Button variant="heroOutline" size="xl">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-accent" />
                <span className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground">2M+</span>
              </div>
              <span className="text-xs sm:text-sm text-primary-foreground/60">Scams Blocked</span>
            </div>
            <div className="text-center border-x border-primary-foreground/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-accent" />
                <span className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground">&lt;1s</span>
              </div>
              <span className="text-xs sm:text-sm text-primary-foreground/60">Detection Time</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-accent" />
                <span className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground">100K+</span>
              </div>
              <span className="text-xs sm:text-sm text-primary-foreground/60">Users Protected</span>
            </div>
          </div>
        </div>

        {/* Floating shield illustration */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float opacity-30">
          <ShieldIcon className="w-24 h-24 text-primary-foreground" variant="safe" />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
