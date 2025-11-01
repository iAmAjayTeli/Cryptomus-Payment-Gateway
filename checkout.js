// ===============================================
// CHECKOUT PAGE - JavaScript
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Plan details configuration
    const planDetails = {
        'Basic': {
            price: 10,
            storage: '10GB SSD Storage',
            bandwidth: '100GB Bandwidth',
            websites: '1 Website'
        },
        'Pro': {
            price: 20,
            storage: '50GB SSD Storage',
            bandwidth: '500GB Bandwidth',
            websites: '5 Websites'
        },
        'Business': {
            price: 30,
            storage: '100GB SSD Storage',
            bandwidth: '1TB Bandwidth',
            websites: 'Unlimited Websites'
        }
    };

    // ===============================================
    // GET PLAN FROM URL QUERY PARAMETER
    // ===============================================
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Get selected plan
    const selectedPlan = getQueryParam('plan') || 'Pro'; // Default to Pro
    
    // Validate plan exists
    if (!planDetails[selectedPlan]) {
        console.error('Invalid plan selected');
        window.location.href = 'pricing.html';
        return;
    }

    // ===============================================
    // UPDATE ORDER SUMMARY
    // ===============================================
    const plan = planDetails[selectedPlan];
    
    // Update plan name
    document.getElementById('selected-plan').textContent = selectedPlan;
    
    // Update plan details
    document.getElementById('plan-storage').textContent = plan.storage;
    document.getElementById('plan-bandwidth').textContent = plan.bandwidth;
    document.getElementById('plan-websites').textContent = plan.websites;
    
    // Update pricing
    const subtotal = plan.price;
    const tax = 0; // No tax for demo
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;

    // ===============================================
    // FORM VALIDATION
    // ===============================================
    const form = document.getElementById('checkout-form');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(input, message) {
        const formGroup = input.parentElement;
        const existingError = formGroup.querySelector('.error-message');
        
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = 'color: #ef4444; font-size: 14px; margin-top: 0.5rem;';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
        
        input.style.borderColor = '#ef4444';
    }

    function clearError(input) {
        const formGroup = input.parentElement;
        const existingError = formGroup.querySelector('.error-message');
        
        if (existingError) {
            existingError.remove();
        }
        
        input.style.borderColor = '#e5e7eb';
    }

    // Real-time validation
    fullnameInput.addEventListener('input', function() {
        if (this.value.trim().length >= 2) {
            clearError(this);
        }
    });

    emailInput.addEventListener('input', function() {
        if (validateEmail(this.value)) {
            clearError(this);
        }
    });

    // ===============================================
    // 🚀 CRYPTOMUS PAYMENT INTEGRATION
    // ===============================================
    
    // 📝 Step 1: Configure backend proxy URL
    // Using backend proxy to avoid CORS issues
    const BACKEND_PROXY_URL = 'http://localhost:3000/create-payment';

    // 🔐 Step 2: Generate MD5 signature for API authentication
    // Cryptomus requires a secure signature to verify requests
    function generateCryptomusSignature(data, apiKey) {
        // Convert data object to Base64 encoded JSON string
        const jsonString = JSON.stringify(data);
        const base64Data = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(jsonString));
        
        // Create MD5 hash: base64(data) + apiKey
        const signature = CryptoJS.MD5(base64Data + apiKey).toString();
        
        console.log('✅ Signature generated successfully');
        return signature;
    }

    // 💳 Step 3: Create Cryptomus payment function (via backend proxy)
    async function createCryptomusPayment(amount, currency, orderData) {
        // 🎬 Check if demo mode is enabled
        if (window.CRYPTOMUS_DEMO_MODE && window.createDemoCryptomusPayment) {
            console.log('🎥 Using DEMO MODE - No real API calls');
            return await window.createDemoCryptomusPayment(amount, currency, orderData);
        }
        
        try {
            console.log('🚀 Creating REAL Cryptomus payment via backend...');
            
            // Prepare payment data for backend proxy
            const paymentData = {
                amount: amount,
                currency: currency,
                order_id: orderData.orderId,
                url_return: window.location.origin + '/thankyou.html',
                customer_name: orderData.name,
                customer_email: orderData.email,
                plan: orderData.plan
            };

            console.log('📦 Sending payment request to backend:', paymentData);

            // Send request to backend proxy
            const response = await fetch(BACKEND_PROXY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            });

            console.log('📡 Backend response received');
            console.log('Response Status:', response.status);
            console.log('Response OK:', response.ok);

            // Parse the response
            const result = await response.json();
            console.log('📋 Full Response:', result);

            if (result.state === 0 && result.result) {
                console.log('✅ Payment created successfully!');
                console.log('Payment ID:', result.result.uuid);
                console.log('Payment URL:', result.result.url);
                
                return {
                    success: true,
                    paymentUrl: result.result.url,
                    paymentId: result.result.uuid
                };
            } else {
                console.error('❌ Payment creation failed:', result.message || result.error);
                return {
                    success: false,
                    error: result.message || result.error || 'Payment creation failed'
                };
            }

        } catch (error) {
            console.error('❌ Backend API Error:', error);
            console.error('Error Type:', error.name);
            console.error('Error Message:', error.message);
            return {
                success: false,
                error: 'Could not connect to payment server. Make sure the backend is running on port 3000.'
            };
        }
    }

    // 🎯 Step 4: Handle payment button click
    const payWithCryptomusBtn = document.getElementById('pay-with-cryptomus');
    
    payWithCryptomusBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        console.log('🎬 Payment button clicked!');
        
        // ✅ Validate form inputs
        let isValid = true;
        
        // Validate full name (minimum 2 characters)
        if (fullnameInput.value.trim().length < 2) {
            showError(fullnameInput, 'Please enter your full name');
            isValid = false;
        } else {
            clearError(fullnameInput);
        }
        
        // Validate email format
        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(emailInput);
        }
        
        // Stop if validation failed
        if (!isValid) {
            console.log('❌ Form validation failed');
            return;
        }
        
        console.log('✅ Form validation passed');
        
        // 🎨 Show loading state on button
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin mr-3"></i> Creating Payment...';
        this.disabled = true;
        this.style.opacity = '0.7';
        
        // 📊 Prepare order data
        const orderId = 'HOSTINO-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        const orderData = {
            orderId: orderId,
            plan: selectedPlan,
            amount: total,
            email: emailInput.value.trim(),
            name: fullnameInput.value.trim()
        };
        
        console.log('📝 Order ID generated:', orderId);
        
        // 💳 Create Cryptomus payment
        const paymentResult = await createCryptomusPayment(
            total,
            'USD',
            orderData
        );
        
        if (paymentResult.success) {
            // 🎉 Success! Store order data and redirect to Cryptomus
            console.log('✅ Redirecting to Cryptomus payment page...');
            
            // Save order data for thank you page
            sessionStorage.setItem('orderData', JSON.stringify(orderData));
            sessionStorage.setItem('paymentId', paymentResult.paymentId);
            
            // Small delay for better UX, then redirect
            setTimeout(() => {
                window.location.href = paymentResult.paymentUrl;
            }, 500);
            
        } else {
            // ❌ Payment creation failed - show error
            console.error('Payment failed:', paymentResult.error);
            
            // Restore button state
            this.innerHTML = originalText;
            this.disabled = false;
            this.style.opacity = '1';
            
            // Show error message to user
            alert('❌ Payment Creation Failed\n\n' + paymentResult.error + '\n\nPlease check your credentials and try again.');
        }
    });

    // ===============================================
    // FORM FIELD ANIMATIONS
    // ===============================================
    const formInputs = document.querySelectorAll('.form-input');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.querySelector('.form-label').style.color = '#007BFF';
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.querySelector('.form-label').style.color = '#374151';
            }
        });
    });

    // ===============================================
    // CRYPTO ICONS ANIMATION
    // ===============================================
    const cryptoIcons = document.querySelectorAll('.crypto-icon-badge');
    
    cryptoIcons.forEach((icon, index) => {
        icon.style.opacity = '0';
        icon.style.transform = 'scale(0)';
        icon.style.transition = `all 0.4s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            icon.style.opacity = '1';
            icon.style.transform = 'scale(1)';
        }, 500);
    });

    // ===============================================
    // ORDER SUMMARY STICKY BEHAVIOR
    // ===============================================
    const orderSummary = document.querySelector('.order-summary');
    
    if (orderSummary && window.innerWidth >= 768) {
        window.addEventListener('scroll', function() {
            const rect = orderSummary.getBoundingClientRect();
            const parentRect = orderSummary.parentElement.getBoundingClientRect();
            
            if (rect.top <= 120) {
                orderSummary.style.position = 'fixed';
                orderSummary.style.top = '120px';
                orderSummary.style.width = parentRect.width + 'px';
            } else {
                orderSummary.style.position = 'sticky';
                orderSummary.style.width = 'auto';
            }
        });
    }

    // ===============================================
    // AUTO-FILL FOR TESTING (Remove in production)
    // ===============================================
    // Uncomment for quick testing
    /*
    document.getElementById('fullname').value = 'John Doe';
    document.getElementById('email').value = 'john@example.com';
    document.getElementById('phone').value = '+1 (555) 123-4567';
    document.getElementById('company').value = 'Hostino Demo';
    */

    console.log('✅ Checkout page loaded');
    console.log('Selected Plan:', selectedPlan);
    console.log('Total Amount:', `$${total.toFixed(2)}`);
});

