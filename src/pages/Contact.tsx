 import { useState } from "react";
 import { Link } from "react-router-dom";
 import { ShieldIcon } from "@/components/icons/ShieldIcon";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, Clock } from "lucide-react";
 import { useToast } from "@/hooks/use-toast";
 
 const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
 
 const Contact = () => {
   const [formData, setFormData] = useState({
     name: "",
     email: "",
     phone: "",
     subject: "",
     category: "",
     message: "",
   });
   const [isLoading, setIsLoading] = useState(false);
   const [isSubmitted, setIsSubmitted] = useState(false);
   const { toast } = useToast();
 
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
   };
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
 
     try {
       const response = await fetch(`${API_BASE_URL}/support/contact`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(formData),
       });
 
       const data = await response.json();
 
       if (response.ok) {
         setIsSubmitted(true);
       } else {
         toast({
           title: "Error",
           description: data.error || "Failed to send message",
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
       <div className="min-h-screen bg-background flex items-center justify-center px-4">
         <Card className="max-w-md w-full text-center">
           <CardContent className="pt-8">
             <div className="w-16 h-16 rounded-full bg-safe/20 flex items-center justify-center mx-auto mb-4">
               <CheckCircle className="w-8 h-8 text-safe" />
             </div>
             <h2 className="text-2xl font-display font-bold text-foreground mb-2">Message Sent!</h2>
             <p className="text-muted-foreground mb-6">
               We've received your message and will respond within 24 hours.
             </p>
             <Link to="/">
               <Button className="w-full">Back to Home</Button>
             </Link>
           </CardContent>
         </Card>
       </div>
     );
   }
 
   return (
     <div className="min-h-screen bg-background">
       {/* Header */}
       <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
           <Link to="/" className="flex items-center gap-2">
             <ShieldIcon className="w-8 h-8 text-primary" variant="safe" />
             <span className="font-display font-bold text-xl text-foreground">
               TrustGuard<span className="text-primary">Unit</span>
             </span>
           </Link>
           <div className="flex items-center gap-3">
             <Link to="/signin">
               <Button variant="ghost" size="sm">Sign In</Button>
             </Link>
           </div>
         </div>
       </header>
 
       {/* Hero */}
       <section className="pt-32 pb-12 px-4 bg-gradient-hero">
         <div className="container mx-auto text-center">
           <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">
             Contact Support
           </h1>
           <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
             Have questions or need help? Our team is here to assist you 24/7.
           </p>
         </div>
       </section>
 
       {/* Contact Info & Form */}
       <section className="py-16 px-4">
         <div className="container mx-auto max-w-6xl">
           <div className="grid lg:grid-cols-3 gap-8">
             {/* Contact Info */}
             <div className="space-y-6">
               <Card>
                 <CardContent className="p-6 flex items-start gap-4">
                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                     <Mail className="w-6 h-6 text-primary" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-foreground mb-1">Email Support</h3>
                     <p className="text-sm text-muted-foreground">support@trustguardunit.com</p>
                   </div>
                 </CardContent>
               </Card>
 
               <Card>
                 <CardContent className="p-6 flex items-start gap-4">
                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                     <Phone className="w-6 h-6 text-primary" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-foreground mb-1">Phone Support</h3>
                     <p className="text-sm text-muted-foreground">+254 700 123 456</p>
                   </div>
                 </CardContent>
               </Card>
 
               <Card>
                 <CardContent className="p-6 flex items-start gap-4">
                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                     <MessageSquare className="w-6 h-6 text-primary" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-foreground mb-1">Live Chat</h3>
                     <p className="text-sm text-muted-foreground">Available in-app 24/7</p>
                   </div>
                 </CardContent>
               </Card>
 
               <Card>
                 <CardContent className="p-6 flex items-start gap-4">
                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                     <Clock className="w-6 h-6 text-primary" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-foreground mb-1">Response Time</h3>
                     <p className="text-sm text-muted-foreground">Within 24 hours</p>
                   </div>
                 </CardContent>
               </Card>
             </div>
 
             {/* Contact Form */}
             <div className="lg:col-span-2">
               <Card>
                 <CardHeader>
                   <CardTitle>Send us a Message</CardTitle>
                   <CardDescription>Fill out the form below and we'll get back to you.</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="grid sm:grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label htmlFor="name">Full Name</Label>
                         <Input
                           id="name"
                           name="name"
                           value={formData.name}
                           onChange={handleChange}
                           placeholder="John Doe"
                           required
                         />
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="email">Email</Label>
                         <Input
                           id="email"
                           name="email"
                           type="email"
                           value={formData.email}
                           onChange={handleChange}
                           placeholder="you@example.com"
                           required
                         />
                       </div>
                     </div>
 
                     <div className="grid sm:grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label htmlFor="phone">Phone (Optional)</Label>
                         <Input
                           id="phone"
                           name="phone"
                           type="tel"
                           value={formData.phone}
                           onChange={handleChange}
                           placeholder="+254 7XX XXX XXX"
                         />
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="category">Category</Label>
                         <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                           <SelectTrigger>
                             <SelectValue placeholder="Select category" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="general">General Inquiry</SelectItem>
                             <SelectItem value="technical">Technical Support</SelectItem>
                             <SelectItem value="billing">Billing & Payments</SelectItem>
                             <SelectItem value="report">Report a Scam</SelectItem>
                             <SelectItem value="business">Business Partnership</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                     </div>
 
                     <div className="space-y-2">
                       <Label htmlFor="subject">Subject</Label>
                       <Input
                         id="subject"
                         name="subject"
                         value={formData.subject}
                         onChange={handleChange}
                         placeholder="How can we help?"
                         required
                       />
                     </div>
 
                     <div className="space-y-2">
                       <Label htmlFor="message">Message</Label>
                       <Textarea
                         id="message"
                         name="message"
                         value={formData.message}
                         onChange={handleChange}
                         placeholder="Describe your issue or question in detail..."
                         rows={6}
                         required
                       />
                     </div>
 
                     <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                       {isLoading ? "Sending..." : (
                         <>
                           <Send className="w-4 h-4 mr-2" />
                           Send Message
                         </>
                       )}
                     </Button>
                   </form>
                 </CardContent>
               </Card>
             </div>
           </div>
         </div>
       </section>
 
       {/* Footer */}
       <footer className="py-8 px-4 border-t border-border">
         <div className="container mx-auto text-center">
           <p className="text-sm text-muted-foreground">
             © 2026 TrustGuardUnit. All rights reserved.
           </p>
         </div>
       </footer>
     </div>
   );
 };
 
 export default Contact;