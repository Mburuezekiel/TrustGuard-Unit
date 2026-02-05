import { Link } from "react-router-dom";
 import { useAuth } from "@/contexts/AuthContext";
import { ShieldIcon } from "./icons/ShieldIcon";
import { Button } from "./ui/button";
 import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from "./ui/dropdown-menu";
 import { User, Settings, LogOut, Crown, Building2 } from "lucide-react";

export const Header = () => {
   const { user, isAuthenticated, logout } = useAuth();
 
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
          <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
           <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
             Blog
           </Link>
           <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
             Contact
           </Link>
        </nav>

        <div className="flex items-center gap-3">
           {isAuthenticated && user ? (
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                   <Avatar className="h-10 w-10">
                     <AvatarImage src={user.avatar} alt={user.name} />
                     <AvatarFallback className="bg-primary text-primary-foreground">
                       {user.name?.charAt(0) || "U"}
                     </AvatarFallback>
                   </Avatar>
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent className="w-56" align="end" forceMount>
                 <DropdownMenuLabel className="font-normal">
                   <div className="flex flex-col space-y-1">
                     <p className="text-sm font-medium leading-none">{user.name}</p>
                     <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                   </div>
                 </DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                   <Link to="/profile" className="flex items-center">
                     <User className="mr-2 h-4 w-4" />
                     Profile
                   </Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                   <Link to="/settings" className="flex items-center">
                     <Settings className="mr-2 h-4 w-4" />
                     Settings
                   </Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                   <Link to="/business-register" className="flex items-center">
                     <Building2 className="mr-2 h-4 w-4" />
                     Register Business
                   </Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                   <Link to="/pricing" className="flex items-center">
                     <Crown className="mr-2 h-4 w-4" />
                     Upgrade Plan
                   </Link>
                 </DropdownMenuItem>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={logout} className="text-danger focus:text-danger">
                   <LogOut className="mr-2 h-4 w-4" />
                   Sign Out
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
           ) : (
             <>
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
             </>
           )}
        </div>
      </div>
    </header>
  );
};
