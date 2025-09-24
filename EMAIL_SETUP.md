# EmailJS Setup Guide for Finésse Detailing

This guide will help you set up EmailJS to enable email functionality for the booking and contact forms.

## 1. Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (allows 200 emails/month)
3. Verify your email address

## 2. Connect Your Email Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions to connect your `info@finessedetailing.com` account

## 3. Create Email Templates

### Booking Template
1. Go to **Email Templates** → **Create New Template**
2. Set Template ID: `booking_template`
3. Use this template:

**Subject:** `New Booking Request - {{service_type}}`

**Content:**
```
New Booking Request Received

Customer Details:
- Name: {{customer_name}}
- Email: {{customer_email}}
- Phone: {{customer_phone}}

Service Details:
- Service: {{service_type}}
- Vehicle: {{vehicle_info}}
- Preferred Date: {{preferred_date}}
- Preferred Time: {{preferred_time}}
- Location: {{service_location}}

Additional Information:
- Mobile Service: {{mobile_service}}
- Newsletter Signup: {{newsletter}}
- Special Notes: {{special_notes}}

Booking submitted on: {{booking_date}} at {{booking_time}}

Please call the customer within 2 hours to confirm the appointment.
```

### Contact Template
1. Create another template with ID: `contact_template`

**Subject:** `New Contact Form Submission`

**Content:**
```
New Contact Form Message

Customer Details:
- Name: {{customer_name}}
- Email: {{customer_email}}
- Phone: {{customer_phone}}

Service Interest: {{service_interest}}
Vehicle: {{vehicle_info}}
Mobile Service: {{mobile_service}}
Newsletter: {{newsletter}}

Message:
{{message}}

Submitted on: {{contact_date}} at {{contact_time}}
```

## 4. Update Website Code

Replace the placeholder values in the code:

### In `/src/pages/book.astro` (line 578):
```javascript
emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your actual public key
```

### In `/src/pages/book.astro` (line 636):
```javascript
emailjs.send('YOUR_SERVICE_ID', 'booking_template', emailData)
```

### In `/src/components/Contact.astro` (line 478):
```javascript
emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your actual public key
```

### In `/src/components/Contact.astro` (line 523):
```javascript
emailjs.send('YOUR_SERVICE_ID', 'contact_template', emailData)
```

## 5. Get Your Keys

1. **Public Key:** Go to Account → General → Public Key
2. **Service ID:** Go to Email Services → copy the Service ID of your connected email service

## 6. Test the Integration

1. Fill out the booking form on your website
2. Check that emails are being sent to `info@finessedetailing.com`
3. Test the contact form as well
4. Check EmailJS dashboard for email statistics

## 7. Email Template Variables

### Booking Form Variables:
- `{{customer_name}}`, `{{customer_email}}`, `{{customer_phone}}`
- `{{service_type}}`, `{{vehicle_info}}`
- `{{preferred_date}}`, `{{preferred_time}}`
- `{{service_location}}`, `{{mobile_service}}`
- `{{newsletter}}`, `{{special_notes}}`
- `{{booking_date}}`, `{{booking_time}}`

### Contact Form Variables:
- `{{customer_name}}`, `{{customer_email}}`, `{{customer_phone}}`
- `{{service_interest}}`, `{{vehicle_info}}`
- `{{mobile_service}}`, `{{newsletter}}`
- `{{message}}`, `{{contact_date}}`, `{{contact_time}}`

## 8. Upgrade Options

- **Free Plan:** 200 emails/month
- **Personal Plan ($15/month):** 1,000 emails/month
- **Team Plan ($50/month):** 10,000 emails/month

## 9. Alternative Email Services

If you prefer a different email service:
- **Formspree:** Simple form-to-email service
- **Netlify Forms:** If hosting on Netlify
- **SendGrid:** For higher volume
- **Custom Backend:** Node.js/PHP solution

## Troubleshooting

- **Emails not sending:** Check browser console for errors
- **Wrong email templates:** Verify template IDs match code
- **Quota exceeded:** Upgrade plan or use alternative service
- **Blocked by email provider:** Check spam folder, whitelist EmailJS

After setup, your booking and contact forms will automatically send formatted emails to your business email address!