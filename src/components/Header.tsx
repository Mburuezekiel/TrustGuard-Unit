import { ShieldIcon } from "./icons/ShieldIcon";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <ShieldIcon className="w-8 h-8 text-primary" variant="safe" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            TrustGuard<span className="text-primary">Unit</span>
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#demo" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Try Demo
          </a>
           <a href="#sniff" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sniff
          </a>
          
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Sign In
          </Button>
          <Button variant="default" size="sm">
            Get Protected
          </Button>
        </div>
      </div>
    </header>
  );
};
