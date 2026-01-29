import { ShieldIcon } from "./icons/ShieldIcon";

export const Footer = () => {
  return (
    <footer className="py-12 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <ShieldIcon className="w-8 h-8 text-safe" variant="safe" />
              <span className="font-display font-bold text-xl">
                TrustGuard<span className="text-safe">AI</span>
              </span>
            </div>
            <p className="text-background/70 max-w-md mb-4">
              Real-time fraud detection for Kenya's mobile money ecosystem. Protecting users before money is lost.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-background/50">Powered by</span>
              <span className="text-sm font-medium text-background/70">OpenAI</span>
              <span className="text-sm font-medium text-background/70">Claude AI</span>
              <span className="text-sm font-medium text-background/70">AWS</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-background/70 hover:text-background transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-background/70 hover:text-background transition-colors">How It Works</a></li>
              <li><a href="#demo" className="text-background/70 hover:text-background transition-colors">Try Demo</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">About Us</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Blog</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Careers</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            © 2025 TrustGuard AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-background/50 hover:text-background transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-background/50 hover:text-background transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
