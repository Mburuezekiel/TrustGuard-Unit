 import { useState } from "react";
 import { Link } from "react-router-dom";
 import { useAuth } from "@/contexts/AuthContext";
 import { ShieldIcon } from "@/components/icons/ShieldIcon";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Switch } from "@/components/ui/switch";
 import { 
   Bell, Shield, Moon, Volume2, Vibrate, Globe, Lock, Trash2
 } from "lucide-react";
 import { useToast } from "@/hooks/use-toast";
 
 const SettingsPage = () => {
   const { user } = useAuth();
   const { toast } = useToast();
   const [settings, setSettings] = useState({
     pushNotifications: true,
     emailAlerts: true,
     smsAlerts: false,
     darkMode: true,
     soundAlerts: true,
     vibration: true,
     autoScan: true,
     trustedContactAlerts: true,
   });
 
   const handleToggle = (key: keyof typeof settings) => {
     setSettings(prev => ({ ...prev, [key]: !prev[key] }));
     toast({
       title: "Settings Updated",
       description: "Your preferences have been saved.",
     });
   };
 
   return (
     <div className="min-h-screen bg-background pb-20">
       {/* Header */}
       <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
           <Link to="/" className="flex items-center gap-2">
             <ShieldIcon className="w-8 h-8 text-primary" variant="safe" />
             <span className="font-display font-bold text-xl text-foreground">
               TrustGuard<span className="text-primary">Unit</span>
             </span>
           </Link>
         </div>
       </header>
 
       {/* Content */}
       <section className="pt-24 pb-8 px-4">
         <div className="container mx-auto max-w-2xl space-y-6">
           <div>
             <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
             <p className="text-muted-foreground">Manage your app preferences</p>
           </div>
 
           {/* Notifications */}
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Bell className="w-5 h-5" />
                 Notifications
               </CardTitle>
               <CardDescription>Control how you receive alerts</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="font-medium text-foreground">Push Notifications</p>
                   <p className="text-sm text-muted-foreground">Get instant fraud alerts</p>
                 </div>
                 <Switch 
                   checked={settings.pushNotifications} 
                   onCheckedChange={() => handleToggle('pushNotifications')} 
                 />
               </div>
               <div className="flex items-center justify-between">
                 <div>
                   <p className="font-medium text-foreground">Email Alerts</p>
                   <p className="text-sm text-muted-foreground">Weekly security reports</p>
                 </div>
                 <Switch 
                   checked={settings.emailAlerts} 
                   onCheckedChange={() => handleToggle('emailAlerts')} 
                 />
               </div>
               <div className="flex items-center justify-between">
                 <div>
                   <p className="font-medium text-foreground">SMS Alerts</p>
                   <p className="text-sm text-muted-foreground">Critical alerts via SMS</p>
                 </div>
                 <Switch 
                   checked={settings.smsAlerts} 
                   onCheckedChange={() => handleToggle('smsAlerts')} 
                 />
               </div>
             </CardContent>
           </Card>
 
           {/* Protection */}
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Shield className="w-5 h-5" />
                 Protection
               </CardTitle>
               <CardDescription>Configure security settings</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="font-medium text-foreground">Auto-Scan</p>
                   <p className="text-sm text-muted-foreground">Automatically scan incoming messages</p>
                 </div>
                 <Switch 
                   checked={settings.autoScan} 
                   onCheckedChange={() => handleToggle('autoScan')} 
                 />
               </div>
               <div className="flex items-center justify-between">
                 <div>
                   <p className="font-medium text-foreground">Trusted Contact Alerts</p>
                   <p className="text-sm text-muted-foreground">Notify family when high-risk detected</p>
                 </div>
                 <Switch 
                   checked={settings.trustedContactAlerts} 
                   onCheckedChange={() => handleToggle('trustedContactAlerts')} 
                 />
               </div>
             </CardContent>
           </Card>
 
           {/* Preferences */}
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Moon className="w-5 h-5" />
                 Preferences
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <Volume2 className="w-5 h-5 text-muted-foreground" />
                   <div>
                     <p className="font-medium text-foreground">Sound Alerts</p>
                     <p className="text-sm text-muted-foreground">Play sound on detection</p>
                   </div>
                 </div>
                 <Switch 
                   checked={settings.soundAlerts} 
                   onCheckedChange={() => handleToggle('soundAlerts')} 
                 />
               </div>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <Vibrate className="w-5 h-5 text-muted-foreground" />
                   <div>
                     <p className="font-medium text-foreground">Vibration</p>
                     <p className="text-sm text-muted-foreground">Vibrate on high-risk alerts</p>
                   </div>
                 </div>
                 <Switch 
                   checked={settings.vibration} 
                   onCheckedChange={() => handleToggle('vibration')} 
                 />
               </div>
             </CardContent>
           </Card>
 
           {/* Danger Zone */}
           <Card className="border-danger/50">
             <CardHeader>
               <CardTitle className="flex items-center gap-2 text-danger">
                 <Trash2 className="w-5 h-5" />
                 Danger Zone
               </CardTitle>
             </CardHeader>
             <CardContent>
               <Button variant="destructive" className="w-full">
                 Delete Account
               </Button>
             </CardContent>
           </Card>
         </div>
       </section>
     </div>
   );
 };
 
 export default SettingsPage;