# Cryptomus Payment Gateway Integration Guide

Complete guide for integrating Cryptomus cryptocurrency payment gateway into the Hostino demo website.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Started with Cryptomus](#getting-started-with-cryptomus)
3. [Integration Steps](#integration-steps)
4. [Code Implementation](#code-implementation)
5. [Testing](#testing)
6. [Going Live](#going-live)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting the integration:

- ✅ Active Cryptomus merchant account
- ✅ Merchant ID and API Key from Cryptomus dashboard
- ✅ Basic understanding of JavaScript and APIs
- ✅ HTTPS-enabled domain (for production)
- ✅ Webhook endpoint for payment notifications (optional for demo)

---

## Getting Started with Cryptomus

### Step 1: Create Account

1. Visit [https://cryptomus.com](https://cryptomus.com)
2. Click **"Sign Up"** or **"Get Started"**
3. Complete the registration form
4. Verify your email address

### Step 2: Get API Credentials

1. Log into your Cryptomus dashboard
2. Navigate to **Settings** → **API Keys**
3. Generate a new API key
4. Save your:
   - **Merchant ID** (UUID format)
   - **API Key** (Secret key)
   - **Payment Key** (Public key)

⚠️ **Important**: Keep your API Key secure and never expose it in frontend code!

### Step 3: Configure Merchant Settings

1. Set your business information
2. Configure accepted cryptocurrencies
3. Set up webhook URL (optional)
4. Define success/fail redirect URLs

---

## Integration Steps

### Overview

The integration process involves:

1. Including Cryptomus SDK
2. Creating payment invoice
3. Redirecting user to payment page
4. Handling payment callback
5. Verifying payment status

---

## Code Implementation

### Method 1: Direct API Integration (Recommended)

#### Backend Setup (Node.js Example)

Create a backend endpoint to handle payment creation:

```javascript
// server.js
const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
app.use(express.json());

const CRYPTOMUS_API_KEY = 'your_api_key_here';
const CRYPTOMUS_MERCHANT_ID = 'your_merchant_id_here';
const CRYPTOMUS_API_URL = 'https://api.cryptomus.com/v1';

// Generate signature for API requests
function generateSignature(data) {
    const jsonData = JSON.stringify(data);
    const hash = crypto.createHash('md5').update(jsonData).digest('hex');
    return crypto.createHash('md5').update(hash + CRYPTOMUS_API_KEY).digest('hex');
}

// Create payment endpoint
app.post('/api/create-payment', async (req, res) => {
    try {
        const { amount, currency, order_id, customer_email, customer_name, plan } = req.body;
        
        const paymentData = {
            amount: amount.toString(),
            currency: currency,
            order_id: order_id,
            url_return: 'https://yourdomain.com/thankyou.html',
            url_callback: 'https://yourdomain.com/api/payment-callback',
            additional_data: JSON.stringify({
                customer_email: customer_email,
                customer_name: customer_name,
                plan: plan
            })
        };
        
        const signature = generateSignature(paymentData);
        
        const response = await axios.post(
            `${CRYPTOMUS_API_URL}/payment`,
            paymentData,
            {
                headers: {
                    'merchant': CRYPTOMUS_MERCHANT_ID,
                    'sign': signature,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        res.json({
            success: true,
            payment_url: response.data.result.url,
            payment_id: response.data.result.uuid
        });
        
    } catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Webhook handler for payment notifications
app.post('/api/payment-callback', (req, res) => {
    try {
        const paymentData = req.body;
        
        // Verify signature
        const signature = generateSignature(paymentData);
        if (signature !== req.headers['sign']) {
            return res.status(400).json({ error: 'Invalid signature' });
        }
        
        // Payment successful
        if (paymentData.status === 'paid') {
            // Update your database
            // Send confirmation email
            // Activate hosting account
            console.log('Payment confirmed:', paymentData.order_id);
        }
        
        res.json({ success: true });
        
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

#### Frontend Integration (checkout.html)

Update the payment button handler in `checkout.html`:

```html
<!-- In checkout.html, replace the Cryptomus placeholder section -->

<script>
document.getElementById('pay-with-cryptomus').addEventListener('click', async function(e) {
    e.preventDefault();
    
    // Validate form
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    
    if (!fullname || !email) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Show loading
    const originalText = this.innerHTML;
    this.innerHTML = '<i class="fas fa-spinner fa-spin mr-3"></i> Processing...';
    this.disabled = true;
    
    try {
        // Get plan and amount
        const urlParams = new URLSearchParams(window.location.search);
        const plan = urlParams.get('plan') || 'Pro';
        const amount = getPlanPrice(plan); // Your function to get price
        
        // Call your backend
        const response = await fetch('/api/create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount,
                currency: 'USD',
                order_id: 'ORDER-' + Date.now(),
                customer_email: email,
                customer_name: fullname,
                plan: plan
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Redirect to Cryptomus payment page
            window.location.href = data.payment_url;
        } else {
            throw new Error(data.error || 'Payment creation failed');
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Payment creation failed. Please try again.');
        this.innerHTML = originalText;
        this.disabled = false;
    }
});

function getPlanPrice(plan) {
    const prices = { 'Basic': 10, 'Pro': 20, 'Business': 30 };
    return prices[plan] || 20;
}
</script>
```

---

### Method 2: Cryptomus Widget Integration (Simpler)

For a simpler integration without backend:

```html
<!-- Add to checkout.html -->
<script src="https://cryptomus.com/widget/v1/widget.js"></script>

<script>
const cryptomusWidget = new CryptomusWidget({
    merchant_id: 'YOUR_MERCHANT_ID',
    amount: '20.00',
    currency: 'USD',
    order_id: 'ORDER-' + Date.now(),
    success_url: 'https://yourdomain.com/thankyou.html',
    fail_url: 'https://yourdomain.com/checkout.html?error=payment_failed'
});

document.getElementById('pay-with-cryptomus').addEventListener('click', function() {
    cryptomusWidget.open();
});
</script>
```

---

## Testing

### Test Mode

Cryptomus provides a test environment:

1. Use test API credentials from dashboard
2. Test payments with small amounts
3. Use testnet cryptocurrencies (if available)

### Test Cases

- ✅ Successful payment flow
- ✅ Payment cancellation
- ✅ Payment timeout
- ✅ Invalid amount handling
- ✅ Network error handling
- ✅ Webhook reception

### Testing Checklist

```
□ Payment creation successful
□ Redirect to Cryptomus works
□ Payment page displays correctly
□ Can select cryptocurrency
□ QR code displays properly
□ Payment confirmation received
□ Redirect back to website works
□ Order details saved correctly
□ Confirmation email sent
□ Thank you page displays order info
```

---

## Going Live

### Pre-Launch Checklist

1. **Security**
   - ✅ API keys stored securely (environment variables)
   - ✅ HTTPS enabled on website
   - ✅ Input validation implemented
   - ✅ XSS protection enabled

2. **Functionality**
   - ✅ All payment flows tested
   - ✅ Webhook verified working
   - ✅ Error handling implemented
   - ✅ Logging configured

3. **User Experience**
   - ✅ Loading states visible
   - ✅ Error messages clear
   - ✅ Success confirmation working
   - ✅ Email notifications sent

### Environment Variables

Store credentials securely:

```bash
# .env file
CRYPTOMUS_MERCHANT_ID=your_merchant_id
CRYPTOMUS_API_KEY=your_api_key
CRYPTOMUS_PAYMENT_KEY=your_payment_key
NODE_ENV=production
```

### Switch to Production

```javascript
const CRYPTOMUS_API_URL = process.env.NODE_ENV === 'production'
    ? 'https://api.cryptomus.com/v1'
    : 'https://api-test.cryptomus.com/v1';
```

---

## Payment Flow Diagram

```
User                    Website                 Cryptomus
  |                        |                        |
  |---Fill Checkout Form-->|                        |
  |                        |                        |
  |---Click Pay Button---->|                        |
  |                        |                        |
  |                        |---Create Payment------>|
  |                        |                        |
  |                        |<--Payment URL----------|
  |                        |                        |
  |<----Redirect-----------|                        |
  |                        |                        |
  |----------------Select Crypto & Pay------------>|
  |                        |                        |
  |                        |<--Webhook Notification-|
  |                        |                        |
  |<--Redirect to Success--|                        |
  |                        |                        |
```

---

## Troubleshooting

### Common Issues

**1. Invalid Signature Error**
```
Error: Invalid signature
Solution: Verify API key and signature generation algorithm
```

**2. Payment Creation Failed**
```
Error: 400 Bad Request
Solution: Check required fields and data format
```

**3. Webhook Not Received**
```
Issue: No payment confirmation
Solution: Verify webhook URL is publicly accessible and HTTPS
```

**4. CORS Error**
```
Error: CORS policy blocked
Solution: Add CORS headers to your backend or use backend proxy
```

### Debug Mode

Enable debug logging:

```javascript
const DEBUG = true;

if (DEBUG) {
    console.log('Payment Data:', paymentData);
    console.log('Signature:', signature);
    console.log('Response:', response);
}
```

---

## Security Best Practices

1. **Never expose API keys** in frontend code
2. **Always validate** payment amounts on backend
3. **Verify webhook signatures** before processing
4. **Use HTTPS** for all communications
5. **Implement rate limiting** on payment endpoints
6. **Log all payment attempts** for auditing
7. **Store sensitive data encrypted** in database

---

## Additional Resources

- 📚 [Cryptomus Documentation](https://doc.cryptomus.com/)
- 💬 [Cryptomus Support](https://cryptomus.com/support)
- 🔗 [API Reference](https://doc.cryptomus.com/api)
- 📺 [Video Tutorials](https://cryptomus.com/tutorials)
- 💡 [Community Forum](https://community.cryptomus.com/)

---

## Support

For integration help:
- Email: support@cryptomus.com
- Live Chat: Available in dashboard
- Telegram: @cryptomus_support

---

## Changelog

### Version 1.0 (Current)
- Initial integration guide
- Backend example (Node.js)
- Frontend integration
- Testing procedures
- Security guidelines

---

**Ready to accept crypto payments? Follow this guide and you'll be up and running in no time!** 🚀


