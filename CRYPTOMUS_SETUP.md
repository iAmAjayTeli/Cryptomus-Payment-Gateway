# 🚀 Cryptomus Payment Gateway - Setup Guide

Complete step-by-step guide to integrate Cryptomus into your Hostino website.

---

## 📺 YouTube Tutorial - Quick Summary

**What We Just Integrated:**
1. ✅ Added CryptoJS library for secure signatures
2. ✅ Created payment creation function with Cryptomus API
3. ✅ Added signature generation (MD5 + Base64)
4. ✅ Connected payment button to API
5. ✅ Added demo mode for testing
6. ✅ Implemented error handling and loading states

---

## 🎬 Testing the Integration (Demo Mode)

### Option 1: Demo Mode (NO Credentials Needed)

**Already enabled!** Just open `checkout.html` and:

1. Fill out the form (any name and email)
2. Click "Pay with Cryptomus"
3. Watch the browser console (F12)
4. See the demo payment flow

**Demo Mode Features:**
- ✅ Simulates API calls without real credentials
- ✅ Shows all console logs for learning
- ✅ 90% success rate (occasionally fails for testing)
- ✅ Orange "DEMO MODE" badge in top-right corner

---

## 🔐 Going Live with Real Cryptomus API

### Step 1: Get Cryptomus Credentials

1. **Sign up at Cryptomus:**
   - Go to [https://cryptomus.com](https://cryptomus.com)
   - Click "Sign Up" and create account
   - Verify your email

2. **Access Dashboard:**
   - Login to [https://app.cryptomus.com](https://app.cryptomus.com)
   - Complete merchant profile setup

3. **Get API Keys:**
   - Navigate to **Settings** → **API Keys**
   - Copy your **Merchant ID** (UUID format)
   - Generate and copy **Payment API Key**

**Example Credentials Format:**
```
Merchant ID: 12345678-1234-1234-1234-123456789abc
API Key: abcdef1234567890abcdef1234567890
```

### Step 2: Configure checkout.js

Open `checkout.js` and find this section (around line 127):

```javascript
const CRYPTOMUS_CONFIG = {
    merchantId: 'YOUR_MERCHANT_ID_HERE',  // ← Replace this
    apiKey: 'YOUR_API_KEY_HERE',          // ← Replace this
    apiUrl: 'https://api.cryptomus.com/v1/payment'
};
```

**Replace with your real credentials:**
```javascript
const CRYPTOMUS_CONFIG = {
    merchantId: '12345678-1234-1234-1234-123456789abc',
    apiKey: 'abcdef1234567890abcdef1234567890',
    apiUrl: 'https://api.cryptomus.com/v1/payment'
};
```

### Step 3: Disable Demo Mode

Open `checkout.html` and comment out the demo script (line 280):

**Change from:**
```html
<script src="cryptomus-demo.js"></script>
```

**To:**
```html
<!-- <script src="cryptomus-demo.js"></script> -->
```

### Step 4: Test with Real API

1. Open `checkout.html` in browser
2. Fill out the form
3. Click "Pay with Cryptomus"
4. You'll be redirected to real Cryptomus payment page!
5. Select cryptocurrency (BTC, ETH, USDT, etc.)
6. Complete payment
7. Get redirected back to thank you page

---

## 🔧 How It Works

### Payment Flow Diagram

```
Customer               Your Website              Cryptomus API
   |                        |                          |
   |--Fill Form------------>|                          |
   |                        |                          |
   |--Click Pay Button----->|                          |
   |                        |                          |
   |                        |--Create Payment--------->|
   |                        |  (with signature)        |
   |                        |                          |
   |                        |<--Payment URL & ID-------|
   |                        |                          |
   |<--Redirect-------------|                          |
   |                        |                          |
   |----------------------Select Crypto--------------->|
   |                        |                          |
   |----------------------Complete Payment------------>|
   |                        |                          |
   |                        |<--Webhook Notification---|
   |                        |                          |
   |<--Redirect to Success--|                          |
```

### Code Explanation

#### 1. Signature Generation
```javascript
function generateCryptomusSignature(data, apiKey) {
    // Step A: Convert data to JSON string
    const jsonString = JSON.stringify(data);
    
    // Step B: Encode to Base64
    const base64Data = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(jsonString)
    );
    
    // Step C: Create MD5 hash of (base64Data + apiKey)
    const signature = CryptoJS.MD5(base64Data + apiKey).toString();
    
    return signature;
}
```

**Why?** Cryptomus uses this to verify requests are from you.

#### 2. Payment Creation
```javascript
const paymentData = {
    amount: '20.00',              // Price in USD
    currency: 'USD',              // Payment currency
    order_id: 'HOSTINO-123456',   // Your unique order ID
    url_return: 'https://yoursite.com/thankyou.html',  // Success URL
    lifetime: 3600,               // Payment expires in 1 hour
    to_currency: 'BTC'           // Default crypto
};
```

#### 3. API Request
```javascript
const response = await fetch('https://api.cryptomus.com/v1/payment', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'merchant': 'YOUR_MERCHANT_ID',
        'sign': 'GENERATED_SIGNATURE'
    },
    body: JSON.stringify(paymentData)
});
```

#### 4. Response Handling
```javascript
const result = await response.json();

if (result.state === 0) {
    // Success! Redirect to payment page
    window.location.href = result.result.url;
} else {
    // Error - show message to user
    alert('Payment creation failed: ' + result.message);
}
```

---

## 📊 API Response Examples

### Success Response
```json
{
  "state": 0,
  "result": {
    "uuid": "abc123-payment-id",
    "order_id": "HOSTINO-1234567890",
    "amount": "20.00",
    "currency": "USD",
    "url": "https://pay.cryptomus.com/pay/abc123",
    "expired_at": 1234567890,
    "status": "check",
    "is_final": false
  }
}
```

### Error Response
```json
{
  "state": 1,
  "message": "Invalid signature",
  "errors": {
    "sign": "Signature verification failed"
  }
}
```

---

## 🐛 Troubleshooting

### Issue 1: "Invalid Signature" Error
**Cause:** API key incorrect or signature generation wrong

**Fix:**
1. Verify API key is correct (no extra spaces)
2. Check that CryptoJS is loaded before checkout.js
3. Ensure JSON.stringify doesn't add extra whitespace

### Issue 2: CORS Error
**Cause:** Browser blocking cross-origin request

**Fix:**
- Cryptomus API supports CORS, but ensure you're testing from localhost or https://
- Don't test from `file://` protocol

### Issue 3: "Merchant not found"
**Cause:** Wrong merchant ID

**Fix:**
1. Copy merchant ID from Cryptomus dashboard exactly
2. Should be UUID format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### Issue 4: Payment Created but Not Redirecting
**Cause:** Check `result.result.url` in console

**Fix:**
```javascript
console.log('Payment URL:', result.result.url);
```

---

## 🎯 Console Logging

The integration includes detailed console logs:

```javascript
✅ Checkout page loaded
✅ Form validation passed
🚀 Creating Cryptomus payment...
📦 Payment data prepared: {...}
✅ Signature generated successfully
📡 API Response received
✅ Payment created successfully!
🆔 Payment ID: abc123
🔗 Payment URL: https://pay.cryptomus.com/...
✅ Redirecting to Cryptomus payment page...
```

**Open browser console (F12) to see all logs!**

---

## 💡 Testing Checklist

### Before Recording Tutorial:

- [ ] Demo mode working and showing console logs
- [ ] Form validation working (try empty fields)
- [ ] Loading spinner appears on button
- [ ] Real API credentials configured
- [ ] Test payment with small amount ($1-5)
- [ ] Payment page opens correctly
- [ ] Can select cryptocurrency
- [ ] Redirect back to website works
- [ ] Thank you page displays order info

---

## 🚀 Production Deployment

### Security Checklist:

1. **Environment Variables (Recommended)**
   ```javascript
   // Don't hardcode in JavaScript!
   // Use server-side environment variables
   const MERCHANT_ID = process.env.CRYPTOMUS_MERCHANT_ID;
   const API_KEY = process.env.CRYPTOMUS_API_KEY;
   ```

2. **Use Backend Proxy** (Best Practice)
   - Don't call Cryptomus API from frontend
   - Create backend endpoint: `/api/create-payment`
   - Backend handles signature and API call
   - Frontend just calls your backend

3. **HTTPS Only**
   - Production site must use HTTPS
   - Cryptomus won't work on HTTP

4. **Webhook Setup**
   - Configure webhook URL in Cryptomus dashboard
   - Verify webhook signatures
   - Update order status in database

---

## 📚 Additional Resources

- **Cryptomus Documentation:** https://doc.cryptomus.com/
- **API Reference:** https://doc.cryptomus.com/payments/creating-invoice
- **Dashboard:** https://app.cryptomus.com/
- **Support:** support@cryptomus.com

---

## 🎬 YouTube Tutorial Script

### Intro (30 seconds)
"Today we're integrating crypto payments into a hosting website using Cryptomus!"

### Part 1: Show Demo (2 min)
- Open website, show pricing
- Go to checkout, show form
- Click pay button, show console logs
- Explain demo mode

### Part 2: Code Walkthrough (8 min)
- Show checkout.html - point to CryptoJS
- Open checkout.js:
  - Explain configuration section
  - Show signature generation
  - Walk through payment creation function
  - Show button handler

### Part 3: Get Credentials (3 min)
- Open Cryptomus.com
- Sign up / login
- Navigate to API settings
- Copy merchant ID and API key

### Part 4: Configure & Test (5 min)
- Paste credentials into code
- Disable demo mode
- Test with real payment
- Show Cryptomus payment page
- Complete test transaction

### Outro (2 min)
- Review what we built
- Security tips
- Call to action

**Total: ~20 minutes**

---

## ✨ What You've Built

You now have:
- ✅ Professional hosting website
- ✅ Working crypto payment integration
- ✅ Secure signature generation
- ✅ Error handling
- ✅ Demo mode for testing
- ✅ Real API integration ready
- ✅ Console logging for debugging

**Congratulations! Your website can now accept Bitcoin, Ethereum, USDT, and more!** 🎉


