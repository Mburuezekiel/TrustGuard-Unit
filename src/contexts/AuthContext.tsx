import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI, setAuthToken, getAuthToken } from "@/services/api";
// import { normalizePhone } from "@/lib/phone";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  plan?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    phone: string,
    password: string,
    email?: string,
    name?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const result = await authAPI.getMe();
          if (result.success && result.data) {
            setUser(result.data as User);
          } else {
            setAuthToken(null);
          }
        } catch {
          setAuthToken(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (phone: string, password: string) => {
    try {
      

      const result = await authAPI.login(phone, password);
      if (result.success && result.data) {
        setAuthToken(result.data.token);
        setUser(result.data.user);
        return { success: true };
      }
      return { success: false, error: result.error || "Login failed" };
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const register = async (phone: string, password: string, email?: string, name?: string) => {
    try {
      
      if (!phone) {
        return { success: false, error: "Please enter a valid phone number" };
      }

      const result = await authAPI.register(phone, password, email, name);
      if (result.success && result.data) {
        const data = result.data as { token: string; user: User };
        // Auto-login after registration
        setAuthToken(data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: result.error || "Registration failed" };
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  };
 
   const logout = () => {
     setAuthToken(null);
     setUser(null);
   };
 
   const updateUser = (data: Partial<User>) => {
     if (user) {
       setUser({ ...user, ...data });
     }
   };
 
   return (
     <AuthContext.Provider value={{
       user,
       isAuthenticated: !!user,
       isLoading,
       login,
       register,
       logout,
       updateUser,
     }}>
       {children}
     </AuthContext.Provider>
   );
 };
 
 export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) {
     throw new Error("useAuth must be used within AuthProvider");
   }
   return context;
 };