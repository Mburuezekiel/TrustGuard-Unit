 import { useState, useEffect } from "react";
 import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Phone, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
 import { darajaAPI } from "@/services/daraja";
 import { useToast } from "@/hooks/use-toast";
 
 interface MpesaPaymentModalProps {
   isOpen: boolean;
   onClose: () => void;
   planName: string;
   amount: number;
   onSuccess?: () => void;
 }
 
 type PaymentStatus = "idle" | "processing" | "pending" | "success" | "failed";
 
 export const MpesaPaymentModal = ({ 
   isOpen, 
   onClose, 
   planName, 
   amount,
   onSuccess 
 }: MpesaPaymentModalProps) => {
   const [phoneNumber, setPhoneNumber] = useState("");
   const [status, setStatus] = useState<PaymentStatus>("idle");
   const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
   const { toast } = useToast();
 
   const handlePayment = async () => {
     if (!phoneNumber || phoneNumber.length < 9) {
       toast({
         title: "Invalid Phone Number",
         description: "Please enter a valid M-Pesa registered phone number.",
         variant: "destructive",
       });
       return;
     }
 
     setStatus("processing");
 
     const formattedPhone = darajaAPI.formatPhoneNumber(phoneNumber);
     
     const response = await darajaAPI.initiatePayment({
       phoneNumber: formattedPhone,
       amount,
       accountReference: `TGU-${planName.toUpperCase()}`,
       transactionDesc: `TrustGuardUnit ${planName} Subscription`,
     });
 
     if (response.success && response.data) {
       setCheckoutRequestId(response.data.CheckoutRequestID);
       setStatus("pending");
       toast({
         title: "Check Your Phone",
         description: "Enter your M-Pesa PIN to complete the payment.",
       });
     } else {
       setStatus("failed");
       toast({
         title: "Payment Failed",
         description: response.error || "Could not initiate payment.",
         variant: "destructive",
       });
     }
   };
 
   // Poll for payment status
   useEffect(() => {
     if (status !== "pending" || !checkoutRequestId) return;
 
     const pollInterval = setInterval(async () => {
       const statusResponse = await darajaAPI.checkStatus(checkoutRequestId);
       
       if (statusResponse.success && statusResponse.data) {
         if (statusResponse.data.ResultCode === "0") {
           setStatus("success");
           clearInterval(pollInterval);
           toast({
             title: "Payment Successful!",
             description: `Receipt: ${statusResponse.data.MpesaReceiptNumber}`,
           });
           onSuccess?.();
         } else if (statusResponse.data.ResultCode !== "pending") {
           setStatus("failed");
           clearInterval(pollInterval);
           toast({
             title: "Payment Failed",
             description: statusResponse.data.ResultDesc || "Transaction was not completed.",
             variant: "destructive",
           });
         }
       }
     }, 3000);
 
     // Stop polling after 2 minutes
     const timeout = setTimeout(() => {
       clearInterval(pollInterval);
       if (status === "pending") {
         setStatus("failed");
         toast({
           title: "Payment Timeout",
           description: "Please try again or check your M-Pesa messages.",
           variant: "destructive",
         });
       }
     }, 120000);
 
     return () => {
       clearInterval(pollInterval);
       clearTimeout(timeout);
     };
   }, [status, checkoutRequestId, onSuccess, toast]);
 
   const handleClose = () => {
     if (status !== "processing" && status !== "pending") {
       setStatus("idle");
       setPhoneNumber("");
       setCheckoutRequestId(null);
       onClose();
     }
   };
 
   return (
     <Dialog open={isOpen} onOpenChange={handleClose}>
       <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2">
             <img 
               src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" 
               alt="M-Pesa" 
               className="h-6"
             />
             Pay with M-Pesa
           </DialogTitle>
           <DialogDescription>
             Subscribe to {planName} plan for KES {amount.toLocaleString()}/month
           </DialogDescription>
         </DialogHeader>
 
         <div className="space-y-6 py-4">
           {status === "idle" && (
             <>
               <div className="space-y-2">
                 <Label htmlFor="phone">M-Pesa Phone Number</Label>
                 <div className="relative">
                   <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input
                     id="phone"
                     type="tel"
                     placeholder="0712 345 678"
                     value={phoneNumber}
                     onChange={(e) => setPhoneNumber(e.target.value)}
                     className="pl-10"
                   />
                 </div>
                 <p className="text-xs text-muted-foreground">
                   Enter the phone number registered with M-Pesa
                 </p>
               </div>
 
               <div className="bg-muted rounded-lg p-4">
                 <div className="flex justify-between text-sm mb-2">
                   <span className="text-muted-foreground">Plan</span>
                   <span className="font-medium">{planName}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Amount</span>
                   <span className="font-bold text-primary">KES {amount.toLocaleString()}</span>
                 </div>
               </div>
 
               <Button onClick={handlePayment} className="w-full" size="lg">
                 Pay KES {amount.toLocaleString()}
               </Button>
             </>
           )}
 
           {status === "processing" && (
             <div className="text-center py-8">
               <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
               <h3 className="font-semibold text-lg mb-2">Processing...</h3>
               <p className="text-muted-foreground text-sm">
                 Sending payment request to your phone
               </p>
             </div>
           )}
 
           {status === "pending" && (
             <div className="text-center py-8">
               <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4 animate-pulse" />
               <h3 className="font-semibold text-lg mb-2">Check Your Phone</h3>
               <p className="text-muted-foreground text-sm mb-4">
                 Enter your M-Pesa PIN to complete the payment
               </p>
               <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                 <Loader2 className="w-3 h-3 animate-spin" />
                 Waiting for confirmation...
               </div>
             </div>
           )}
 
           {status === "success" && (
             <div className="text-center py-8">
               <CheckCircle className="w-12 h-12 text-safe mx-auto mb-4" />
               <h3 className="font-semibold text-lg mb-2">Payment Successful!</h3>
               <p className="text-muted-foreground text-sm mb-4">
                 Your {planName} subscription is now active
               </p>
               <Button onClick={handleClose} className="w-full">
                 Continue
               </Button>
             </div>
           )}
 
           {status === "failed" && (
             <div className="text-center py-8">
               <XCircle className="w-12 h-12 text-danger mx-auto mb-4" />
               <h3 className="font-semibold text-lg mb-2">Payment Failed</h3>
               <p className="text-muted-foreground text-sm mb-4">
                 The transaction was not completed
               </p>
               <Button onClick={() => setStatus("idle")} variant="outline" className="w-full">
                 Try Again
               </Button>
             </div>
           )}
         </div>
       </DialogContent>
     </Dialog>
   );
 };