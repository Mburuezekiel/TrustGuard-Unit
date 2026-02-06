 import { Link, useLocation } from "react-router-dom";
 import { Home, Shield, FileText, User, Settings } from "lucide-react";
 import { motion } from "framer-motion";
 import { cn } from "@/lib/utils";
 
 const navItems = [
   { path: "/", icon: Home, label: "Home" },
   { path: "/app", icon: Shield, label: "Protect" },
   { path: "/pricing", icon: FileText, label: "Plans" },
   { path: "/profile", icon: User, label: "Profile" },
  //  { path: "/settings", icon: Settings, label: "Settings" },
 ];
 
 export const BottomNavigation = () => {
   const location = useLocation();
 
   // Hide on certain pages
   const hideOn = ["/signin", "/signup", "/forgot-password"];
   if (hideOn.includes(location.pathname)) return null;
 
   return (
     <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border md:hidden">
       <div className="flex items-center justify-around h-16 px-2">
         {navItems.map((item) => {
           const isActive = location.pathname === item.path;
           return (
             <Link
               key={item.path}
               to={item.path}
               className={cn(
                 "flex flex-col items-center justify-center flex-1 h-full relative",
                 isActive ? "text-primary" : "text-muted-foreground"
               )}
             >
               {isActive && (
                 <motion.div
                   layoutId="activeTab"
                   className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full"
                   transition={{ type: "spring", stiffness: 500, damping: 30 }}
                 />
               )}
               <item.icon className={cn("w-5 h-5", isActive && "scale-110")} />
               <span className="text-xs mt-1 font-medium">{item.label}</span>
             </Link>
           );
         })}
       </div>
     </nav>
   );
 };