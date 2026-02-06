 import { useState } from "react";
 import { Link } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { ShieldIcon } from "@/components/icons/ShieldIcon";
 import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
 import { useToast } from "@/hooks/use-toast";
 
 const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://m-pesa-shield-1.onrender.com/api/v1';
 
 const ForgotPassword = () => {
   const [email, setEmail] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [isSubmitted, setIsSubmitted] = useState(false);
   const { toast } = useToast();
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
 
     try {
       const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email }),
       });
 
       const data = await response.json();
 
       if (response.ok) {
         setIsSubmitted(true);
       } else {
         toast({
           title: "Error",
           description: data.error || "Failed to send reset email",
           variant: "destructive",
         });
       }
     } catch (error) {
       toast({
         title: "Network Error",
         description: "Please check your connection and try again.",
         variant: "destructive",
       });
     } finally {
       setIsLoading(false);
     }
   };
 
   if (isSubmitted) {
     return (
       <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12">
         <div className="w-full max-w-md">
           <Card className="border-border/50 shadow-xl">
             <CardContent className="pt-8 text-center">
               <div className="w-16 h-16 rounded-full bg-safe/20 flex items-center justify-center mx-auto mb-4">
                 <CheckCircle className="w-8 h-8 text-safe" />
               </div>
               <h2 className="text-2xl font-display font-bold text-foreground mb-2">Check Your Email</h2>
               <p className="text-muted-foreground mb-6">
                 We've sent password reset instructions to <strong>{email}</strong>
               </p>
               <Link to="/signin">
                 <Button variant="outline" className="w-full">
                   <ArrowLeft className="w-4 h-4 mr-2" />
                   Back to Sign In
                 </Button>
               </Link>
             </CardContent>
           </Card>
         </div>
       </div>
     );
   }
 
   return (
     <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12">
       <div className="w-full max-w-md">
         <div className="flex items-center justify-center gap-2 mb-8">
           <ShieldIcon className="w-10 h-10 text-primary-foreground" variant="safe" />
           <span className="font-display font-bold text-2xl text-primary-foreground">
             TrustGuard<span className="text-accent">Unit</span>
           </span>
         </div>
 
         <Card className="border-border/50 shadow-xl">
           <CardHeader className="text-center">
             <CardTitle className="text-2xl font-display">Reset Password</CardTitle>
             <CardDescription>
               Enter your email and we'll send you reset instructions
             </CardDescription>
           </CardHeader>
           <CardContent>
             <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="email">Email Address</Label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input
                     id="email"
                     type="email"
                     placeholder="you@example.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="pl-10"
                     required
                   />
                 </div>
               </div>
 
               <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                 {isLoading ? "Sending..." : "Send Reset Link"}
               </Button>
             </form>
 
             <div className="mt-6 text-center">
               <Link to="/signin" className="text-sm text-primary hover:underline flex items-center justify-center gap-1">
                 <ArrowLeft className="w-4 h-4" />
                 Back to Sign In
               </Link>
             </div>
           </CardContent>
         </Card>
       </div>
     </div>
   );
 };
 
 export default ForgotPassword;