 const express = require('express');
 const router = express.Router();
 const axios = require('axios');
 const { protect, optionalAuth } = require('../middleware/auth');
 
 // M-Pesa Daraja API Configuration
 const DARAJA_BASE_URL = process.env.DARAJA_ENV === 'production' 
   ? 'https://api.safaricom.co.ke'
   : 'https://sandbox.safaricom.co.ke';
 
 const DARAJA_CONSUMER_KEY = process.env.DARAJA_CONSUMER_KEY;
 const DARAJA_CONSUMER_SECRET = process.env.DARAJA_CONSUMER_SECRET;
 const DARAJA_SHORTCODE = process.env.DARAJA_SHORTCODE || '174379';
 const DARAJA_PASSKEY = process.env.DARAJA_PASSKEY;
 const DARAJA_CALLBACK_URL = process.env.DARAJA_CALLBACK_URL;
 
 // Generate OAuth Token
 const getOAuthToken = async () => {
   try {
     const auth = Buffer.from(`${DARAJA_CONSUMER_KEY}:${DARAJA_CONSUMER_SECRET}`).toString('base64');
     
     const response = await axios.get(
       `${DARAJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
       {
         headers: {
           Authorization: `Basic ${auth}`,
         },
       }
     );
     
     return response.data.access_token;
   } catch (error) {
     console.error('OAuth Token Error:', error.response?.data || error.message);
     throw new Error('Failed to get OAuth token');
   }
 };
 
 // Generate password for STK Push
 const generatePassword = () => {
   const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').substring(0, 14);
   const password = Buffer.from(`${DARAJA_SHORTCODE}${DARAJA_PASSKEY}${timestamp}`).toString('base64');
   return { password, timestamp };
 };
 
 // @desc    Initiate STK Push
 // @route   POST /api/v1/payments/mpesa/stk-push
 router.post('/mpesa/stk-push', optionalAuth, async (req, res, next) => {
   try {
     const { phoneNumber, amount, accountReference, transactionDesc } = req.body;
     
     if (!phoneNumber || !amount) {
       return res.status(400).json({ 
         success: false, 
         error: 'Phone number and amount are required' 
       });
     }
 
     const token = await getOAuthToken();
     const { password, timestamp } = generatePassword();
 
     const stkPushRequest = {
       BusinessShortCode: DARAJA_SHORTCODE,
       Password: password,
       Timestamp: timestamp,
       TransactionType: 'CustomerPayBillOnline',
       Amount: Math.round(amount),
       PartyA: phoneNumber,
       PartyB: DARAJA_SHORTCODE,
       PhoneNumber: phoneNumber,
       CallBackURL: DARAJA_CALLBACK_URL || `${process.env.BACKEND_URL}/api/v1/payments/mpesa/callback`,
       AccountReference: accountReference || 'TrustGuardUnit',
       TransactionDesc: transactionDesc || 'Subscription Payment',
     };
 
     const response = await axios.post(
       `${DARAJA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
       stkPushRequest,
       {
         headers: {
           Authorization: `Bearer ${token}`,
           'Content-Type': 'application/json',
         },
       }
     );
 
     // Store transaction for tracking
     // In production: save to database
     console.log('STK Push Response:', response.data);
 
     res.status(200).json({
       success: true,
       data: response.data,
     });
   } catch (error) {
     console.error('STK Push Error:', error.response?.data || error.message);
     res.status(500).json({
       success: false,
       error: error.response?.data?.errorMessage || 'Failed to initiate payment',
     });
   }
 });
 
 // @desc    M-Pesa Callback
 // @route   POST /api/v1/payments/mpesa/callback
 router.post('/mpesa/callback', async (req, res) => {
   try {
     const { Body } = req.body;
     const stkCallback = Body?.stkCallback;
 
     console.log('M-Pesa Callback:', JSON.stringify(stkCallback, null, 2));
 
     if (stkCallback?.ResultCode === 0) {
       // Payment successful
       const metadata = stkCallback.CallbackMetadata?.Item || [];
       const amount = metadata.find(i => i.Name === 'Amount')?.Value;
       const receiptNumber = metadata.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
       const transactionDate = metadata.find(i => i.Name === 'TransactionDate')?.Value;
       const phoneNumber = metadata.find(i => i.Name === 'PhoneNumber')?.Value;
 
       // In production: Update user subscription, send confirmation email
       console.log('Payment Success:', { amount, receiptNumber, transactionDate, phoneNumber });
     } else {
       // Payment failed
       console.log('Payment Failed:', stkCallback?.ResultDesc);
     }
 
     res.status(200).json({ success: true });
   } catch (error) {
     console.error('Callback Error:', error);
     res.status(200).json({ success: true }); // Always return 200 to M-Pesa
   }
 });
 
 // @desc    Check payment status
 // @route   GET /api/v1/payments/mpesa/status/:checkoutRequestId
 router.get('/mpesa/status/:checkoutRequestId', async (req, res) => {
   try {
     const { checkoutRequestId } = req.params;
     
     const token = await getOAuthToken();
     const { password, timestamp } = generatePassword();
 
     const response = await axios.post(
       `${DARAJA_BASE_URL}/mpesa/stkpushquery/v1/query`,
       {
         BusinessShortCode: DARAJA_SHORTCODE,
         Password: password,
         Timestamp: timestamp,
         CheckoutRequestID: checkoutRequestId,
       },
       {
         headers: {
           Authorization: `Bearer ${token}`,
           'Content-Type': 'application/json',
         },
       }
     );
 
     const resultCode = response.data.ResultCode;
     
     if (resultCode === '0') {
       res.status(200).json({
         success: true,
         data: {
           ResultCode: '0',
           ResultDesc: 'Success',
         },
       });
     } else if (resultCode === undefined || response.data.errorCode === '500.001.1001') {
       // Still processing
       res.status(200).json({
         success: true,
         data: {
           ResultCode: 'pending',
           ResultDesc: 'Transaction is still being processed',
         },
       });
     } else {
       res.status(200).json({
         success: true,
         data: {
           ResultCode: resultCode,
           ResultDesc: response.data.ResultDesc || 'Transaction failed',
         },
       });
     }
   } catch (error) {
     console.error('Status Query Error:', error.response?.data || error.message);
     
     // Treat query errors as "pending" to allow continued polling
     res.status(200).json({
       success: true,
       data: {
         ResultCode: 'pending',
         ResultDesc: 'Unable to query status',
       },
     });
   }
 });
 
 module.exports = router;