// ===============================================
// THANK YOU PAGE - JavaScript
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===============================================
    // RETRIEVE ORDER DATA
    // ===============================================
    const orderData = JSON.parse(sessionStorage.getItem('orderData') || '{}');
    
    // If no order data, redirect to pricing
    if (!orderData.plan) {
        console.warn('No order data found');
        // For demo purposes, use default data instead of redirecting
        orderData.plan = 'Pro';
        orderData.amount = 20;
        orderData.email = 'customer@example.com';
        orderData.name = 'Valued Customer';
    }

    // ===============================================
    // UPDATE ORDER DETAILS
    // ===============================================
    
    // Generate order ID
    const orderId = 'HS-' + new Date().getFullYear() + '-' + 
                    Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    document.getElementById('order-id').textContent = orderId;
    document.getElementById('plan-name').textContent = orderData.plan + ' Hosting';
    document.getElementById('amount-paid').textContent = '$' + orderData.amount.toFixed(2);
    
    // Set current date
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('transaction-date').textContent = dateStr;

    // ===============================================
    // CONFETTI ANIMATION
    // ===============================================
    function createConfetti() {
        const confettiContainer = document.getElementById('confetti-container');
        const colors = ['#007BFF', '#00D4FF', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
        const confettiCount = 100;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                
                // Random shapes
                if (Math.random() > 0.5) {
                    confetti.style.borderRadius = '50%';
                }
                
                confettiContainer.appendChild(confetti);
                
                // Remove confetti after animation
                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 15); // Stagger the creation
        }
    }
    
    // Trigger confetti on load
    setTimeout(createConfetti, 500);

    // ===============================================
    // SUCCESS ICON ANIMATION
    // ===============================================
    const successIcon = document.querySelector('.success-icon');
    
    if (successIcon) {
        // Add pulse effect
        setInterval(() => {
            successIcon.style.transform = 'scale(1.05)';
            setTimeout(() => {
                successIcon.style.transform = 'scale(1)';
            }, 200);
        }, 3000);
    }

    // ===============================================
    // STEP ANIMATIONS
    // ===============================================
    const stepNumbers = document.querySelectorAll('.success-step-number');
    
    stepNumbers.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'scale(0) rotate(-180deg)';
        step.style.transition = `all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${index * 0.2 + 0.5}s`;
        
        setTimeout(() => {
            step.style.opacity = '1';
            step.style.transform = 'scale(1) rotate(0deg)';
        }, 100);
    });

    // ===============================================
    // CARD ENTRANCE ANIMATIONS
    // ===============================================
    const cards = [
        document.querySelector('.success-card'),
        document.querySelector('.order-details-card'),
        document.querySelector('.support-box')
    ];
    
    cards.forEach((card, index) => {
        if (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.6s ease ${index * 0.2 + 0.3}s`;
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }
    });

    // ===============================================
    // BUTTON HOVER EFFECTS
    // ===============================================
    const buttons = document.querySelectorAll('.btn-success-primary, .btn-success-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ===============================================
    // SUPPORT LINKS ANIMATION
    // ===============================================
    const supportLinks = document.querySelectorAll('.support-link');
    
    supportLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateX(-20px)';
        link.style.transition = `all 0.4s ease ${index * 0.1 + 1}s`;
        
        setTimeout(() => {
            link.style.opacity = '1';
            link.style.transform = 'translateX(0)';
        }, 100);
    });

    // ===============================================
    // ORDER ID COPY TO CLIPBOARD
    // ===============================================
    const orderIdElement = document.getElementById('order-id');
    
    if (orderIdElement) {
        orderIdElement.style.cursor = 'pointer';
        orderIdElement.title = 'Click to copy';
        
        orderIdElement.addEventListener('click', function() {
            const textToCopy = this.textContent;
            
            // Copy to clipboard
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show feedback
                const originalText = this.textContent;
                this.textContent = '✓ Copied!';
                this.style.color = '#10b981';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.color = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        });
    }

    // ===============================================
    // EMAIL CONFIRMATION SIMULATION
    // ===============================================
    function simulateEmailSending() {
        const emailNotification = document.createElement('div');
        emailNotification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 15px;
            max-width: 350px;
            opacity: 0;
            transform: translateX(400px);
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;
        
        emailNotification.innerHTML = `
            <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #10b981, #059669); 
                        border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-envelope text-white text-xl"></i>
            </div>
            <div>
                <div style="font-weight: 700; color: #1f2937; margin-bottom: 4px;">Email Sent!</div>
                <div style="font-size: 14px; color: #6b7280;">Confirmation sent to ${orderData.email || 'your email'}</div>
            </div>
            <button onclick="this.parentElement.remove()" 
                    style="position: absolute; top: 10px; right: 10px; background: none; 
                           border: none; color: #9ca3af; cursor: pointer; font-size: 18px;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(emailNotification);
        
        setTimeout(() => {
            emailNotification.style.opacity = '1';
            emailNotification.style.transform = 'translateX(0)';
        }, 2000);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            emailNotification.style.opacity = '0';
            emailNotification.style.transform = 'translateX(400px)';
            setTimeout(() => emailNotification.remove(), 400);
        }, 7000);
    }
    
    simulateEmailSending();

    // ===============================================
    // PROGRESS BAR ANIMATION (Account Setup)
    // ===============================================
    function showSetupProgress() {
        const progressNotification = document.createElement('div');
        progressNotification.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 20px 30px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            min-width: 300px;
            opacity: 0;
            transition: opacity 0.4s ease;
        `;
        
        progressNotification.innerHTML = `
            <div style="text-align: center; margin-bottom: 10px;">
                <i class="fas fa-cog fa-spin text-blue-600 text-2xl"></i>
            </div>
            <div style="font-weight: 700; color: #1f2937; text-align: center; margin-bottom: 10px;">
                Setting up your account...
            </div>
            <div style="width: 100%; height: 6px; background: #e5e7eb; border-radius: 10px; overflow: hidden;">
                <div id="progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #007BFF, #00D4FF); 
                                               transition: width 0.5s ease; border-radius: 10px;"></div>
            </div>
            <div id="progress-text" style="text-align: center; font-size: 14px; color: #6b7280; margin-top: 8px;">
                0% complete
            </div>
        `;
        
        document.body.appendChild(progressNotification);
        
        setTimeout(() => {
            progressNotification.style.opacity = '1';
        }, 3000);
        
        // Animate progress
        let progress = 0;
        const progressBar = progressNotification.querySelector('#progress-bar');
        const progressText = progressNotification.querySelector('#progress-text');
        
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                
                progressText.innerHTML = '<i class="fas fa-check text-green-600"></i> Setup Complete!';
                progressText.style.color = '#10b981';
                progressText.style.fontWeight = '700';
                
                setTimeout(() => {
                    progressNotification.style.opacity = '0';
                    setTimeout(() => progressNotification.remove(), 400);
                }, 2000);
            }
            
            progressBar.style.width = progress + '%';
            progressText.textContent = Math.floor(progress) + '% complete';
        }, 500);
    }
    
    setTimeout(showSetupProgress, 4000);

    // ===============================================
    // CLEAR SESSION DATA (after 1 minute)
    // ===============================================
    setTimeout(() => {
        sessionStorage.removeItem('orderData');
    }, 60000);

    console.log('🎉 Thank you page loaded successfully!');
    console.log('Order ID:', orderId);
    console.log('Plan:', orderData.plan);
});

