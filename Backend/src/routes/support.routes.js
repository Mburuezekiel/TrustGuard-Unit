 const express = require('express');
 const router = express.Router();
 const nodemailer = require('nodemailer');
 
 // Email transporter configuration
 const createTransporter = () => {
   return nodemailer.createTransport({
     host: process.env.SMTP_HOST || 'smtp.gmail.com',
     port: process.env.SMTP_PORT || 587,
     secure: false,
     auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASS,
     },
   });
 };
 
 // @desc    Send contact form message
 // @route   POST /api/v1/support/contact
 router.post('/contact', async (req, res) => {
   try {
     const { name, email, phone, subject, category, message } = req.body;
 
     if (!name || !email || !subject || !message) {
       return res.status(400).json({
         success: false,
         error: 'Name, email, subject, and message are required',
       });
     }
 
     const transporter = createTransporter();
 
     // Send to support team
     await transporter.sendMail({
       from: process.env.SMTP_FROM || 'noreply@trustguardunit.com',
       to: process.env.SUPPORT_EMAIL || 'support@trustguardunit.com',
       subject: `[${category || 'General'}] ${subject}`,
       html: `
         <h2>New Contact Form Submission</h2>
         <p><strong>From:</strong> ${name} (${email})</p>
         <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
         <p><strong>Category:</strong> ${category || 'General'}</p>
         <p><strong>Subject:</strong> ${subject}</p>
         <hr/>
         <p>${message.replace(/\n/g, '<br/>')}</p>
       `,
     });
 
     // Send confirmation to user
     await transporter.sendMail({
       from: process.env.SMTP_FROM || 'noreply@trustguardunit.com',
       to: email,
       subject: 'We received your message - TrustGuardUnit',
       html: `
         <h2>Thank you for contacting us!</h2>
         <p>Hi ${name},</p>
         <p>We've received your message and will respond within 24 hours.</p>
         <p><strong>Your message:</strong></p>
         <blockquote style="padding: 10px; background: #f5f5f5; border-left: 4px solid #007bff;">
           ${message.replace(/\n/g, '<br/>')}
         </blockquote>
         <p>Best regards,<br/>TrustGuardUnit Support Team</p>
       `,
     });
 
     res.status(200).json({
       success: true,
       message: 'Message sent successfully',
     });
   } catch (error) {
     console.error('Contact Form Error:', error);
     res.status(500).json({
       success: false,
       error: 'Failed to send message. Please try again.',
     });
   }
 });
 
 module.exports = router;