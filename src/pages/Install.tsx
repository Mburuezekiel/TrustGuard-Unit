import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldIcon } from "@/components/icons/ShieldIcon";
import { Link } from "react-router-dom";
import { 
  Download, 
  Smartphone, 
  Check, 
  Share, 
  Plus,
  Apple,
  Chrome
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ShieldIcon className="w-8 h-8 text-blue-400" variant="safe" />
            <span className="font-display font-bold text-xl text-white">
              Scam<span className="text-blue-400">Alert</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-500/20 mb-6">
              <Smartphone className="w-10 h-10 text-blue-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Install ScamAlert
            </h1>
            <p className="text-lg text-slate-400 max-w-md mx-auto">
              Get instant fraud protection on your home screen. Works offline and loads instantly.
            </p>
          </div>

          {isInstalled ? (
            <Card className="bg-green-500/10 border-green-500/30">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Already Installed!</h2>
                <p className="text-slate-400 mb-6">
                  ScamAlert is already installed on your device. Open it from your home screen.
                </p>
                <Link to="/app">
                  <Button className="bg-green-500 hover:bg-green-600">
                    Open App
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Android/Chrome Install */}
              {isInstallable && (
                <Card className="bg-slate-800/50 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <Chrome className="w-6 h-6 text-blue-400" />
                      Quick Install
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 mb-4">
                      Click the button below to install ScamAlert directly to your home screen.
                    </p>
                    <Button 
                      onClick={handleInstall}
                      className="w-full bg-blue-500 hover:bg-blue-600"
                      size="lg"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Install ScamAlert
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* iOS Instructions */}
              {isIOS && (
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <Apple className="w-6 h-6" />
                      Install on iPhone/iPad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 font-bold">1</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Tap the Share button</p>
                        <p className="text-slate-400 text-sm">Located at the bottom of Safari</p>
                        <Share className="w-6 h-6 text-blue-400 mt-2" />
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 font-bold">2</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Scroll down and tap "Add to Home Screen"</p>
                        <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-slate-700/50 rounded-lg">
                          <Plus className="w-5 h-5 text-blue-400" />
                          <span className="text-white text-sm">Add to Home Screen</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 font-bold">3</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Tap "Add" to confirm</p>
                        <p className="text-slate-400 text-sm">ScamAlert will appear on your home screen</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Generic Instructions */}
              {!isInstallable && !isIOS && (
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <Download className="w-6 h-6 text-blue-400" />
                      How to Install
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-400">
                      To install ScamAlert, look for the install option in your browser menu:
                    </p>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-400" />
                        Chrome: Menu → "Install ScamAlert"
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-400" />
                        Edge: Menu → "Apps" → "Install this site as an app"
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-400" />
                        Firefox: Address bar → Install icon
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Features */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Why Install?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {[
                      { title: "Works Offline", desc: "Access your protection history even without internet" },
                      { title: "Instant Access", desc: "Launch directly from your home screen" },
                      { title: "Push Notifications", desc: "Get real-time alerts for new threats" },
                      { title: "Native Feel", desc: "Full-screen experience like a native app" },
                    ].map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{feature.title}</p>
                          <p className="text-slate-400 text-sm">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Link to="/app">
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                    Continue to Web App Instead
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Install;
