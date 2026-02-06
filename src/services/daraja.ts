 // M-Pesa Daraja API Integration
 const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://m-pesa-shield-1.onrender.com/api/v1';
 
 export interface STKPushRequest {
   phoneNumber: string;
   amount: number;
   accountReference: string;
   transactionDesc: string;
 }
 
 export interface STKPushResponse {
   success: boolean;
   data?: {
     MerchantRequestID: string;
     CheckoutRequestID: string;
     ResponseCode: string;
     ResponseDescription: string;
     CustomerMessage: string;
   };
   error?: string;
 }
 
 export interface PaymentStatus {
   success: boolean;
   data?: {
     ResultCode: string;
     ResultDesc: string;
     MpesaReceiptNumber?: string;
     TransactionDate?: string;
     PhoneNumber?: string;
     Amount?: number;
   };
   error?: string;
 }
 
 export const darajaAPI = {
   // Initiate STK Push
   initiatePayment: async (request: STKPushRequest): Promise<STKPushResponse> => {
     try {
       const response = await fetch(`${API_BASE_URL}/payments/mpesa/stk-push`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(request),
       });
 
       const data = await response.json();
       
       if (!response.ok) {
         return { success: false, error: data.error || 'Payment initiation failed' };
       }
       
       return { success: true, data: data.data };
     } catch (error) {
       return { success: false, error: 'Network error. Please try again.' };
     }
   },
 
   // Check payment status
   checkStatus: async (checkoutRequestId: string): Promise<PaymentStatus> => {
     try {
       const response = await fetch(`${API_BASE_URL}/payments/mpesa/status/${checkoutRequestId}`);
       const data = await response.json();
       
       if (!response.ok) {
         return { success: false, error: data.error || 'Status check failed' };
       }
       
       return { success: true, data: data.data };
     } catch (error) {
       return { success: false, error: 'Network error. Please try again.' };
     }
   },
 
   // Format phone number for M-Pesa (254XXXXXXXXX)
   formatPhoneNumber: (phone: string): string => {
     let formatted = phone.replace(/\s+/g, '').replace(/[^0-9]/g, '');
     
     if (formatted.startsWith('0')) {
       formatted = '254' + formatted.substring(1);
     } else if (formatted.startsWith('+254')) {
       formatted = formatted.substring(1);
     } else if (!formatted.startsWith('254')) {
       formatted = '254' + formatted;
     }
     
     return formatted;
   },
 };