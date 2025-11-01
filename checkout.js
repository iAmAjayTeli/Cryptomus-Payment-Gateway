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
    // 🚀 CRYPTOMUS WIDGET INTEGRATION
    // Widget is initialized in checkout.html
    // This just handles form validation
    // ===============================================

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

