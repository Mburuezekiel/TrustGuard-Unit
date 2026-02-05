 import { useState, useEffect } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { Download, X, Smartphone } from "lucide-react";
 import { Button } from "@/components/ui/button";
 
 interface BeforeInstallPromptEvent extends Event {
   prompt: () => Promise<void>;
   userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
 }
 
 export const PWAInstallBanner = () => {
   const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
   const [showBanner, setShowBanner] = useState(false);
   const [isInstalled, setIsInstalled] = useState(false);
 
   useEffect(() => {
     // Check if already installed
     if (window.matchMedia("(display-mode: standalone)").matches) {
       setIsInstalled(true);
       return;
     }
 
     // Check if dismissed recently
     const dismissed = localStorage.getItem("pwa_banner_dismissed");
     if (dismissed && Date.now() - parseInt(dismissed) < 86400000) {
       return;
     }
 
     const handleBeforeInstall = (e: Event) => {
       e.preventDefault();
       setDeferredPrompt(e as BeforeInstallPromptEvent);
       setShowBanner(true);
     };
 
     window.addEventListener("beforeinstallprompt", handleBeforeInstall);
 
     // For iOS - show banner after delay
     const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
     if (isIOS && !isInstalled) {
       setTimeout(() => setShowBanner(true), 3000);
     }
 
     return () => {
       window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
     };
   }, [isInstalled]);
 
   const handleInstall = async () => {
     if (deferredPrompt) {
       await deferredPrompt.prompt();
       const { outcome } = await deferredPrompt.userChoice;
       if (outcome === "accepted") {
         setIsInstalled(true);
       }
       setDeferredPrompt(null);
       setShowBanner(false);
     } else {
       // iOS fallback - show instructions
       alert("To install: Tap the Share button, then 'Add to Home Screen'");
     }
   };
 
   const handleDismiss = () => {
     setShowBanner(false);
     localStorage.setItem("pwa_banner_dismissed", Date.now().toString());
   };
 
   if (isInstalled) return null;
 
   return (
     <AnimatePresence>
       {showBanner && (
         <motion.div
           initial={{ y: 100, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           exit={{ y: 100, opacity: 0 }}
           className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
         >
           <div className="bg-card border border-border rounded-xl p-4 shadow-2xl">
             <div className="flex items-start gap-3">
               <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                 <Smartphone className="w-6 h-6 text-primary" />
               </div>
               <div className="flex-1">
                 <h3 className="font-semibold text-foreground mb-1">Install ScamAlert</h3>
                 <p className="text-sm text-muted-foreground mb-3">
                   Get instant fraud protection. Works offline!
                 </p>
                 <div className="flex gap-2">
                   <Button size="sm" onClick={handleInstall} className="flex-1">
                     <Download className="w-4 h-4 mr-1" />
                     Install App
                   </Button>
                   <Button size="sm" variant="ghost" onClick={handleDismiss}>
                     <X className="w-4 h-4" />
                   </Button>
                 </div>
               </div>
             </div>
           </div>
         </motion.div>
       )}
     </AnimatePresence>
   );
 };