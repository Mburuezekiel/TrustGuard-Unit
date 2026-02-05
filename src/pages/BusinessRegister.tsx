 import { useState } from "react";
 import { Link } from "react-router-dom";
 import { ShieldIcon } from "@/components/icons/ShieldIcon";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { 
   Building2, Upload, CheckCircle, AlertTriangle, Loader2, 
   FileCheck, Shield, Clock, BadgeCheck
 } from "lucide-react";
 import { useToast } from "@/hooks/use-toast";
 import { Progress } from "@/components/ui/progress";
 
 const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
 
 type VerificationStatus = "idle" | "uploading" | "verifying" | "verified" | "rejected";
 
 const BusinessRegister = () => {
   const [formData, setFormData] = useState({
     businessName: "",
     registrationNumber: "",
     paymentMethod: "",
     paymentCode: "",
     email: "",
     phone: "",
     description: "",
   });
   const [certificateFile, setCertificateFile] = useState<File | null>(null);
   const [status, setStatus] = useState<VerificationStatus>("idle");
   const [verificationProgress, setVerificationProgress] = useState(0);
   const [verificationResult, setVerificationResult] = useState<{
     isLegit: boolean;
     confidence: number;
     reasons: string[];
   } | null>(null);
   const { toast } = useToast();
 
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
   };
 
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
       const file = e.target.files[0];
       if (file.size > 10 * 1024 * 1024) {
         toast({
           title: "File too large",
           description: "Please upload a file smaller than 10MB",
           variant: "destructive",
         });
         return;
       }
       setCertificateFile(file);
     }
   };
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     
     if (!certificateFile) {
       toast({
         title: "Certificate Required",
         description: "Please upload your business registration certificate",
         variant: "destructive",
       });
       return;
     }
 
     setStatus("uploading");
     setVerificationProgress(0);
 
     try {
       const formDataToSend = new FormData();
       Object.entries(formData).forEach(([key, value]) => {
         formDataToSend.append(key, value);
       });
       formDataToSend.append("certificate", certificateFile);
 
       // Simulate upload progress
       const uploadInterval = setInterval(() => {
         setVerificationProgress(prev => {
           if (prev >= 40) {
             clearInterval(uploadInterval);
             return 40;
           }
           return prev + 5;
         });
       }, 100);
 
       const response = await fetch(`${API_BASE_URL}/business/register`, {
         method: 'POST',
         body: formDataToSend,
       });
 
       clearInterval(uploadInterval);
       setStatus("verifying");
       
       // Simulate AI verification progress
       const verifyInterval = setInterval(() => {
         setVerificationProgress(prev => {
           if (prev >= 95) {
             clearInterval(verifyInterval);
             return 95;
           }
           return prev + 3;
         });
       }, 100);
 
       const data = await response.json();
       clearInterval(verifyInterval);
       setVerificationProgress(100);
 
       if (response.ok && data.verification) {
         setVerificationResult(data.verification);
         setStatus(data.verification.isLegit ? "verified" : "rejected");
       } else {
         throw new Error(data.error || "Verification failed");
       }
     } catch (error) {
       toast({
         title: "Verification Failed",
         description: error instanceof Error ? error.message : "Please try again later",
         variant: "destructive",
       });
       setStatus("idle");
     }
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
 
       {/* Hero */}
       <section className="pt-32 pb-12 px-4 bg-gradient-hero">
         <div className="container mx-auto text-center">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 mb-6">
             <Building2 className="w-4 h-4 text-primary-foreground" />
             <span className="text-sm font-medium text-primary-foreground">Business Verification</span>
           </div>
           <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">
             Register Your Business
           </h1>
           <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
             Get verified as a legitimate business. Build trust with customers and protect your brand from impersonation.
           </p>
         </div>
       </section>
 
       {/* Benefits */}
       <section className="py-8 px-4 -mt-6">
         <div className="container mx-auto">
           <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
             {[
               { icon: BadgeCheck, title: "Verified Badge", desc: "Get a trust badge on your business profile" },
               { icon: Shield, title: "Scam Protection", desc: "Prevent impersonators from using your name" },
               { icon: Clock, title: "Quick Verification", desc: "AI-powered verification in under 24 hours" },
             ].map((item, i) => (
               <Card key={i} className="bg-card/50 backdrop-blur">
                 <CardContent className="p-4 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                     <item.icon className="w-5 h-5 text-primary" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                     <p className="text-xs text-muted-foreground">{item.desc}</p>
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
         </div>
       </section>
 
       {/* Main Form */}
       <section className="py-8 px-4">
         <div className="container mx-auto max-w-2xl">
           {/* Verification Status */}
           {status !== "idle" && (
             <Card className="mb-8">
               <CardContent className="p-6">
                 <div className="flex items-center gap-4 mb-4">
                   {status === "uploading" && <Loader2 className="w-8 h-8 text-primary animate-spin" />}
                   {status === "verifying" && <FileCheck className="w-8 h-8 text-primary animate-pulse" />}
                   {status === "verified" && <CheckCircle className="w-8 h-8 text-safe" />}
                   {status === "rejected" && <AlertTriangle className="w-8 h-8 text-danger" />}
                   <div>
                     <h3 className="font-semibold text-foreground">
                       {status === "uploading" && "Uploading Documents..."}
                       {status === "verifying" && "AI Verification in Progress..."}
                       {status === "verified" && "Business Verified!"}
                       {status === "rejected" && "Verification Failed"}
                     </h3>
                     <p className="text-sm text-muted-foreground">
                       {status === "uploading" && "Please wait while we upload your certificate"}
                       {status === "verifying" && "Our AI is analyzing your business documents"}
                       {status === "verified" && "Your business has been marked as legitimate"}
                       {status === "rejected" && "We couldn't verify your business documents"}
                     </p>
                   </div>
                 </div>
                 
                 {(status === "uploading" || status === "verifying") && (
                   <Progress value={verificationProgress} className="h-2" />
                 )}
 
                 {verificationResult && (
                   <div className={`mt-4 p-4 rounded-lg ${verificationResult.isLegit ? 'bg-safe/10' : 'bg-danger/10'}`}>
                     <div className="flex items-center justify-between mb-2">
                       <span className="text-sm font-medium">Confidence Score</span>
                       <span className={`text-lg font-bold ${verificationResult.isLegit ? 'text-safe' : 'text-danger'}`}>
                         {Math.round(verificationResult.confidence * 100)}%
                       </span>
                     </div>
                     <ul className="space-y-1">
                       {verificationResult.reasons.map((reason, i) => (
                         <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                           {verificationResult.isLegit ? 
                             <CheckCircle className="w-4 h-4 text-safe" /> : 
                             <AlertTriangle className="w-4 h-4 text-danger" />
                           }
                           {reason}
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
               </CardContent>
             </Card>
           )}
 
           {/* Registration Form */}
           <Card>
             <CardHeader>
               <CardTitle>Business Registration Form</CardTitle>
               <CardDescription>
                 Provide your business details and upload your registration certificate for verification.
               </CardDescription>
             </CardHeader>
             <CardContent>
               <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="space-y-4">
                   <div className="space-y-2">
                     <Label htmlFor="businessName">Business Name *</Label>
                     <Input
                       id="businessName"
                       name="businessName"
                       value={formData.businessName}
                       onChange={handleChange}
                       placeholder="e.g., Acme Corporation Ltd"
                       required
                     />
                   </div>
 
                   <div className="space-y-2">
                     <Label htmlFor="registrationNumber">Registration Number *</Label>
                     <Input
                       id="registrationNumber"
                       name="registrationNumber"
                       value={formData.registrationNumber}
                       onChange={handleChange}
                       placeholder="e.g., CPR/2024/123456"
                       required
                     />
                   </div>
 
                   <div className="grid sm:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="paymentMethod">Payment Method *</Label>
                       <Select onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                         <SelectTrigger>
                           <SelectValue placeholder="Select method" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="paybill">Paybill Number</SelectItem>
                           <SelectItem value="till">Till Number</SelectItem>
                           <SelectItem value="send_money">Send Money</SelectItem>
                           <SelectItem value="bank">Bank Account</SelectItem>
                           <SelectItem value="other">Other</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="paymentCode">Payment Code/Number *</Label>
                       <Input
                         id="paymentCode"
                         name="paymentCode"
                         value={formData.paymentCode}
                         onChange={handleChange}
                         placeholder="e.g., 522522"
                         required
                       />
                     </div>
                   </div>
 
                   <div className="grid sm:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="email">Business Email *</Label>
                       <Input
                         id="email"
                         name="email"
                         type="email"
                         value={formData.email}
                         onChange={handleChange}
                         placeholder="info@business.com"
                         required
                       />
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="phone">Business Phone *</Label>
                       <Input
                         id="phone"
                         name="phone"
                         type="tel"
                         value={formData.phone}
                         onChange={handleChange}
                         placeholder="+254 7XX XXX XXX"
                         required
                       />
                     </div>
                   </div>
 
                   <div className="space-y-2">
                     <Label htmlFor="description">Business Description</Label>
                     <Textarea
                       id="description"
                       name="description"
                       value={formData.description}
                       onChange={handleChange}
                       placeholder="Briefly describe your business activities..."
                       rows={3}
                     />
                   </div>
 
                   {/* Certificate Upload */}
                   <div className="space-y-2">
                     <Label>Business Registration Certificate *</Label>
                     <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                       certificateFile ? 'border-safe bg-safe/5' : 'border-border hover:border-primary'
                     }`}>
                       {certificateFile ? (
                         <div className="flex items-center justify-center gap-3">
                           <FileCheck className="w-8 h-8 text-safe" />
                           <div className="text-left">
                             <p className="font-medium text-foreground">{certificateFile.name}</p>
                             <p className="text-sm text-muted-foreground">
                               {(certificateFile.size / 1024 / 1024).toFixed(2)} MB
                             </p>
                           </div>
                           <Button 
                             type="button" 
                             variant="ghost" 
                             size="sm"
                             onClick={() => setCertificateFile(null)}
                           >
                             Change
                           </Button>
                         </div>
                       ) : (
                         <label className="cursor-pointer">
                           <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                           <p className="font-medium text-foreground mb-1">
                             Click to upload certificate
                           </p>
                           <p className="text-sm text-muted-foreground">
                             PDF, JPG, PNG up to 10MB
                           </p>
                           <input
                             type="file"
                             accept=".pdf,.jpg,.jpeg,.png"
                             onChange={handleFileChange}
                             className="hidden"
                           />
                         </label>
                       )}
                     </div>
                   </div>
                 </div>
 
                 <Button 
                   type="submit" 
                   className="w-full" 
                   size="lg"
                   disabled={status === "uploading" || status === "verifying"}
                 >
                   {status === "uploading" || status === "verifying" ? (
                     <>
                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                       Processing...
                     </>
                   ) : status === "verified" ? (
                     <>
                       <CheckCircle className="w-4 h-4 mr-2" />
                       Verified Successfully
                     </>
                   ) : (
                     <>
                       <Shield className="w-4 h-4 mr-2" />
                       Submit for Verification
                     </>
                   )}
                 </Button>
               </form>
             </CardContent>
           </Card>
         </div>
       </section>
     </div>
   );
 };
 
 export default BusinessRegister;