 import { useState, useEffect } from "react";
 import { Link, useNavigate, useLocation } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { ShieldIcon } from "@/components/icons/ShieldIcon";
 import { Phone, Lock, Eye, EyeOff } from "lucide-react";
 import { useToast } from "@/hooks/use-toast";
 import { useAuth } from "@/contexts/AuthContext";
 
 const SignIn = () => {
   const [phone, setPhone] = useState("");
   const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const navigate = useNavigate();
   const location = useLocation();
   const { toast } = useToast();
   const { login, isAuthenticated } = useAuth();
 
   useEffect(() => {
     if (isAuthenticated) {
       const from = (location.state as any)?.from?.pathname || "/app";
       navigate(from, { replace: true });
     }
   }, [isAuthenticated, navigate, location]);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
 
     const result = await login(phone, password);
     
     if (result.success) {
       toast({
         title: "Welcome back!",
         description: "You've successfully signed in to TrustGuardUnit.",
       });
       const from = (location.state as any)?.from?.pathname || "/app";
       navigate(from, { replace: true });
     } else {
       toast({
         title: "Sign in failed",
         description: result.error || "Invalid credentials. Please try again.",
         variant: "destructive",
       });
     }
     
     setIsLoading(false);
   };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <ShieldIcon className="w-10 h-10 text-primary-foreground" variant="safe" />
          <span className="font-display font-bold text-2xl text-primary-foreground">
            TrustGuard<span className="text-accent">Unit</span>
          </span>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-display">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your fraud protection dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                 <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                   <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                     id="phone"
                     type="tel"
                     placeholder="+254 7XX XXX XXX"
                     value={phone}
                     onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                 <Link to="/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                 </Link>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary font-medium hover:underline">
                  Sign up for free
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-primary-foreground/60 mt-6">
          Protected by TrustGuardUnit • Privacy First
        </p>
      </div>
    </div>
  );
};

export default SignIn;
