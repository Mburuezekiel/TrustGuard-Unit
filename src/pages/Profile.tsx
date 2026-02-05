 import { Link, useNavigate } from "react-router-dom";
 import { useAuth } from "@/contexts/AuthContext";
 import { ShieldIcon } from "@/components/icons/ShieldIcon";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
 import { 
   User, Mail, Phone, Shield, Crown, LogOut, Settings, 
   Bell, History, CreditCard, Building2
 } from "lucide-react";
 
 const Profile = () => {
   const { user, isAuthenticated, logout } = useAuth();
   const navigate = useNavigate();
 
   const handleLogout = () => {
     logout();
     navigate("/");
   };
 
   if (!isAuthenticated) {
     return (
       <div className="min-h-screen bg-background flex items-center justify-center px-4">
         <Card className="max-w-md w-full text-center">
           <CardContent className="pt-8">
             <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
             <h2 className="text-2xl font-display font-bold text-foreground mb-2">Not Signed In</h2>
             <p className="text-muted-foreground mb-6">
               Sign in to view your profile and protection history.
             </p>
             <div className="flex gap-3">
               <Link to="/signin" className="flex-1">
                 <Button className="w-full">Sign In</Button>
               </Link>
               <Link to="/signup" className="flex-1">
                 <Button variant="outline" className="w-full">Sign Up</Button>
               </Link>
             </div>
           </CardContent>
         </Card>
       </div>
     );
   }
 
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
 
       {/* Profile Header */}
       <section className="pt-24 pb-8 px-4 bg-gradient-hero">
         <div className="container mx-auto max-w-2xl">
           <div className="flex items-center gap-4">
             <Avatar className="w-20 h-20 border-4 border-primary-foreground/20">
               <AvatarImage src={user?.avatar} />
               <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                 {user?.name?.charAt(0) || "U"}
               </AvatarFallback>
             </Avatar>
             <div>
               <h1 className="text-2xl font-display font-bold text-primary-foreground">
                 {user?.name || "User"}
               </h1>
               <p className="text-primary-foreground/70">{user?.email}</p>
               <div className="flex items-center gap-2 mt-2">
                 <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                   user?.plan === 'premium' 
                     ? 'bg-accent/20 text-accent' 
                     : 'bg-primary-foreground/10 text-primary-foreground'
                 }`}>
                   {user?.plan === 'premium' ? (
                     <><Crown className="w-3 h-3 inline mr-1" /> Premium</>
                   ) : (
                     <><Shield className="w-3 h-3 inline mr-1" /> Free Plan</>
                   )}
                 </span>
               </div>
             </div>
           </div>
         </div>
       </section>
 
       {/* Profile Content */}
       <section className="py-8 px-4">
         <div className="container mx-auto max-w-2xl space-y-6">
           {/* Account Info */}
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <User className="w-5 h-5" />
                 Account Information
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                 <Mail className="w-5 h-5 text-muted-foreground" />
                 <div>
                   <p className="text-sm text-muted-foreground">Email</p>
                   <p className="font-medium text-foreground">{user?.email}</p>
                 </div>
               </div>
               <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                 <Phone className="w-5 h-5 text-muted-foreground" />
                 <div>
                   <p className="text-sm text-muted-foreground">Phone</p>
                   <p className="font-medium text-foreground">{user?.phone || "Not set"}</p>
                 </div>
               </div>
             </CardContent>
           </Card>
 
           {/* Quick Actions */}
           <Card>
             <CardHeader>
               <CardTitle>Quick Actions</CardTitle>
             </CardHeader>
             <CardContent className="grid gap-3">
               <Link to="/settings">
                 <Button variant="outline" className="w-full justify-start gap-3">
                   <Settings className="w-5 h-5" />
                   Account Settings
                 </Button>
               </Link>
               <Link to="/app">
                 <Button variant="outline" className="w-full justify-start gap-3">
                   <History className="w-5 h-5" />
                   Protection History
                 </Button>
               </Link>
               <Link to="/pricing">
                 <Button variant="outline" className="w-full justify-start gap-3">
                   <CreditCard className="w-5 h-5" />
                   Upgrade Plan
                 </Button>
               </Link>
               <Link to="/business-register">
                 <Button variant="outline" className="w-full justify-start gap-3">
                   <Building2 className="w-5 h-5" />
                   Register Business
                 </Button>
               </Link>
             </CardContent>
           </Card>
 
           {/* Logout */}
           <Button 
             variant="destructive" 
             className="w-full" 
             onClick={handleLogout}
           >
             <LogOut className="w-4 h-4 mr-2" />
             Sign Out
           </Button>
         </div>
       </section>
     </div>
   );
 };
 
 export default Profile;