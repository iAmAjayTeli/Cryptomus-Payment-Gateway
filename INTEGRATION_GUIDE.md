# 🚀 Cryptomus Payment Gateway - Integration Guide

Complete guide to integrate Cryptomus cryptocurrency payments into any website using the **Widget Method** (simplest approach).

---

## 📋 Table of Contents

1. [What You'll Learn](#what-youll-learn)
2. [Prerequisites](#prerequisites)
3. [Getting Started](#getting-started)
4. [Integration Steps](#integration-steps)
5. [Complete Code Example](#complete-code-example)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)
8. [Going Live](#going-live)

---

## 🎯 What You'll Learn

By the end of this guide, you'll be able to:
- ✅ Accept 50+ cryptocurrencies on your website
- ✅ Integrate Cryptomus in under 10 minutes
- ✅ No backend server required
- ✅ No CORS issues
- ✅ Production-ready solution

---

## 📦 Prerequisites

Before starting:
- ✅ Cryptomus account ([Sign up free](https://cryptomus.com))
- ✅ Merchant ID and Payment API Key
- ✅ Basic HTML/JavaScript knowledge
- ✅ Website with payment form

---

## 🚀 Getting Started

### Step 1: Create Cryptomus Account

1. Visit [https://cryptomus.com](https://cryptomus.com)
2. Click **"Sign Up"**
3. Complete registration
4. Verify your email

### Step 2: Get API Credentials

1. Login to [Cryptomus Dashboard](https://app.cryptomus.com)
2. Go to **Settings** → **API Keys**
3. Look for **"Payment API"** or **"User API"** section
4. Copy your:
   - **Merchant ID** (UUID format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
   - **Payment API Key** (40 characters)
5. **Important:** Make sure API key is **ACTIVE** (not inactive)

**Example credentials format:**
```
Merchant ID: 8ca4881f-0c2a-44d2-8b69-5bca0fcc4189
API Key: 305e28fcecdfee2ce29025359832d63bb12b9617
```

**Note:** You DON'T need to create a widget in the dashboard!

---

## 🛠️ Integration Steps

### Method: Cryptomus Widget (Recommended)

This is the simplest method - no backend required!

#### Step 1: Add Widget Script to Your HTML

Add this before the closing `</body>` tag:

```html
<!-- Cryptomus Widget Script -->
<script src="https://cryptomus.com/widget/v1/widget.js"></script>
```

#### Step 2: Initialize the Widget

Add this JavaScript code after the widget script:

```html
<script>
    // Initialize Cryptomus Widget
    const cryptomusWidget = new CryptomusWidget({
        merchant_id: 'YOUR_MERCHANT_ID_HERE',  // Your Merchant ID
        amount: '20.00',                       // Payment amount
        currency: 'USD',                       // Currency code
        order_id: 'ORDER-' + Date.now(),      // Unique order ID
        success_url: window.location.origin + '/thankyou.html',  // Success redirect
        fail_url: window.location.origin + '/checkout.html?error=payment_failed'  // Fail redirect
    });
</script>
```

#### Step 3: Add Payment Button Handler

Connect your payment button to open the widget:

```html
<script>
    document.getElementById('pay-with-cryptomus').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get form values
        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        
        // Validate form
        if (!fullname || fullname.length < 2) {
            alert('Please enter your full name');
            return;
        }
        
        if (!email || !email.includes('@')) {
            alert('Please enter a valid email');
            return;
        }
        
        // Open Cryptomus payment widget
        cryptomusWidget.open();
    });
</script>
```

---

## 💻 Complete Code Example

Here's a complete working example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Checkout - Cryptomus Payment</title>
</head>
<body>
    <h1>Complete Your Purchase</h1>
    
    <!-- Checkout Form -->
    <form id="checkout-form">
        <label>Full Name:</label>
        <input type="text" id="fullname" required>
        
        <label>Email:</label>
        <input type="email" id="email" required>
        
        <label>Amount: $20.00</label>
        
        <button type="button" id="pay-with-cryptomus">
            Pay with Cryptocurrency
        </button>
    </form>

    <!-- Cryptomus Widget Script -->
    <script src="https://cryptomus.com/widget/v1/widget.js"></script>

    <!-- Widget Implementation -->
    <script>
        // Initialize Cryptomus Widget
        const cryptomusWidget = new CryptomusWidget({
            merchant_id: 'YOUR_MERCHANT_ID_HERE',
            amount: '20.00',
            currency: 'USD',
            order_id: 'ORDER-' + Date.now(),
            success_url: window.location.origin + '/thankyou.html',
            fail_url: window.location.origin + '/checkout.html?error=payment_failed'
        });
        
        // Handle payment button click
        document.getElementById('pay-with-cryptomus').addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get form values
            const fullname = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim();
            
            // Validate form
            if (!fullname || fullname.length < 2) {
                alert('Please enter your full name');
                return;
            }
            
            if (!email || !email.includes('@')) {
                alert('Please enter a valid email');
                return;
            }
            
            // Store customer info (optional)
            sessionStorage.setItem('orderData', JSON.stringify({
                name: fullname,
                email: email
            }));
            
            // Open payment widget
            cryptomusWidget.open();
        });
    </script>
</body>
</html>
```

---

## 🔧 Advanced: Dynamic Pricing

For multiple plans with different prices:

```html
<script>
    // Get selected plan and calculate amount
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPlan = urlParams.get('plan') || 'Pro';
    const planPrices = { 'Basic': 10, 'Pro': 20, 'Business': 30 };
    const paymentAmount = planPrices[selectedPlan] || 20;
    
    // Initialize Cryptomus Widget with dynamic amount
    const cryptomusWidget = new CryptomusWidget({
        merchant_id: 'YOUR_MERCHANT_ID_HERE',
        amount: paymentAmount.toString(),  // Convert to string
        currency: 'USD',
        order_id: 'HOSTINO-' + Date.now(),
        success_url: window.location.origin + '/thankyou.html',
        fail_url: window.location.origin + '/checkout.html?plan=' + selectedPlan
    });
    
    console.log('✅ Cryptomus Widget initialized');
    console.log('💰 Amount: $' + paymentAmount);
    console.log('📦 Plan: ' + selectedPlan);
    
    // Handle payment button with validation and storage
    document.getElementById('pay-with-cryptomus').addEventListener('click', function(e) {
        e.preventDefault();
        
        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        
        if (!fullname || fullname.length < 2) {
            alert('❌ Please enter your full name');
            return;
        }
        
        if (!email || !email.includes('@')) {
            alert('❌ Please enter a valid email address');
            return;
        }
        
        console.log('✅ Form validated - Opening payment widget...');
        
        // Store customer info for thank you page
        sessionStorage.setItem('orderData', JSON.stringify({
            plan: selectedPlan,
            amount: paymentAmount,
            email: email,
            name: fullname
        }));
        
        // Open Cryptomus payment widget
        cryptomusWidget.open();
    });
</script>
```

---

## 🧪 Testing

### Local Testing

1. **Start a local server:**

   **Using Python:**
   ```bash
   python -m http.server 8000
   ```

   **Using Node.js:**
   ```bash
   npx http-server -p 8000
   ```

2. **Open in browser:**
   ```
   http://localhost:8000/checkout.html
   ```

3. **Test the flow:**
   - Fill form
   - Click payment button
   - Widget should open
   - See cryptocurrency options

---

## 🐛 Troubleshooting

### Issue 1: Widget Doesn't Open

**Solutions:**
- Check browser console (F12) for errors
- Verify widget script loaded: `https://cryptomus.com/widget/v1/widget.js`
- Confirm merchant_id is correct
- Use `http://localhost` not `file://`

### Issue 2: "API not active" Error

**Solution:**
1. Go to Cryptomus Dashboard → Settings → API Keys
2. Click **"Activate"** on your Payment API Key
3. Wait 1-2 minutes
4. Try again

### Issue 3: Variable Redeclaration Error

**Error:** "Cannot redeclare block-scoped variable"

**Cause:** Widget initialized twice in same file

**Solution:** Remove duplicate initialization, keep only one

### Issue 4: Wrong Amount

**Fix:**
- Use string: `'20.00'` not `20`
- Include decimals: `'20.00'` not `'20'`

---

## 🌐 Going Live

### Pre-Launch Checklist

- [ ] Test with small real payment ($1-5)
- [ ] Verify redirects work
- [ ] Test on mobile
- [ ] API key is ACTIVE
- [ ] URLs use HTTPS

### Production Configuration

```javascript
const cryptomusWidget = new CryptomusWidget({
    merchant_id: 'YOUR_MERCHANT_ID',
    amount: '20.00',
    currency: 'USD',
    order_id: 'ORDER-' + Date.now(),
    success_url: 'https://yourdomain.com/thankyou.html',  // ✅ HTTPS
    fail_url: 'https://yourdomain.com/checkout.html'      // ✅ HTTPS
});
```

---

## 💰 Supported Cryptocurrencies

- Bitcoin (BTC)
- Ethereum (ETH)
- USDT (Tether)
- USDC (USD Coin)
- Litecoin (LTC)
- And 45+ more!

---

## ❓ FAQ

**Q: Do I need a backend server?**  
A: No! Widget works entirely from browser.

**Q: Do I create a widget in dashboard?**  
A: No! Just use your Merchant ID.

**Q: What are the fees?**  
A: 1-2% per transaction.

**Q: How long do payments take?**  
A: 1-60 minutes depending on cryptocurrency.

---

## 📞 Support

- **Docs:** https://doc.cryptomus.com/
- **Support:** support@cryptomus.com
- **Dashboard:** https://app.cryptomus.com

---

## ✅ Quick Summary

**What You Need:**
1. Cryptomus account
2. Merchant ID
3. Active Payment API Key

**Integration Steps:**
1. Add widget script
2. Initialize with Merchant ID
3. Connect to payment button

**Time Required:** 10 minutes

---

**That's it! You're ready to accept crypto payments! 🎉**

*Last Updated: November 1, 2025*
