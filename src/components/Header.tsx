import { Link } from "react-router-dom";
import { ShieldIcon } from "./icons/ShieldIcon";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            <ShieldIcon className="w-8 h-8 text-primary" variant="safe" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            TrustGuard<span className="text-primary">Unit</span>
          </span>
        </Link>
        
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
          <a href="#sms-service" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            SMS Service
          </a>
          <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/signin">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="default" size="sm">
              Get Protected
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
