// ===============================================
// 🎬 CRYPTOMUS DEMO MODE
// ===============================================
// This file provides a demo mode for testing the integration
// without needing real Cryptomus credentials.
//
// Include this BEFORE checkout.js to enable demo mode:
// <script src="cryptomus-demo.js"></script>
// <script src="checkout.js"></script>
// ===============================================

console.log('🎬 Cryptomus Demo Mode Enabled!');
console.log('💡 This simulates payment creation without real API calls');

// Override the Cryptomus configuration with demo credentials
window.CRYPTOMUS_DEMO_MODE = true;

// Demo payment simulator
window.createDemoCryptomusPayment = async function(amount, currency, orderData) {
    console.log('🎥 DEMO MODE: Simulating Cryptomus payment creation...');
    console.log('📦 Demo Payment Data:', {
        amount: amount,
        currency: currency,
        order_id: orderData.orderId,
        customer: orderData.name,
        email: orderData.email,
        plan: orderData.plan
    });
    
    // Simulate API delay (500ms-1500ms)
    const delay = Math.random() * 1000 + 500;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // 90% success rate for demo purposes
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
        // Generate fake payment URL and ID
        const fakePaymentId = 'demo-' + Math.random().toString(36).substr(2, 9);
        const fakePaymentUrl = `https://pay.cryptomus.com/pay/${fakePaymentId}`;
        
        console.log('✅ DEMO: Payment created successfully!');
        console.log('🆔 Demo Payment ID:', fakePaymentId);
        console.log('🔗 Demo Payment URL:', fakePaymentUrl);
        
        return {
            success: true,
            paymentUrl: fakePaymentUrl,
            paymentId: fakePaymentId,
            isDemoMode: true
        };
    } else {
        console.log('❌ DEMO: Simulating payment failure');
        return {
            success: false,
            error: 'Demo error: Random failure for testing purposes',
            isDemoMode: true
        };
    }
};

// Alert user that demo mode is active
window.addEventListener('DOMContentLoaded', function() {
    // Add demo mode indicator
    const demoIndicator = document.createElement('div');
    demoIndicator.innerHTML = `
        <div style="position: fixed; top: 80px; right: 20px; background: linear-gradient(135deg, #f59e0b, #d97706); 
                    color: white; padding: 12px 20px; border-radius: 10px; z-index: 9999; 
                    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4); font-family: Inter, sans-serif; font-size: 14px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-video" style="font-size: 20px;"></i>
                <div>
                    <div style="font-weight: 700;">🎬 DEMO MODE</div>
                    <div style="font-size: 12px; opacity: 0.9;">Testing without real API</div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(demoIndicator);
    
    console.log('==================================================');
    console.log('🎬 CRYPTOMUS DEMO MODE INSTRUCTIONS');
    console.log('==================================================');
    console.log('✅ Fill out the checkout form');
    console.log('✅ Click "Pay with Cryptomus"');
    console.log('✅ Watch the console for demo payment flow');
    console.log('✅ Payment will redirect to a demo URL');
    console.log('');
    console.log('💡 To use REAL Cryptomus API:');
    console.log('   1. Remove <script src="cryptomus-demo.js"></script>');
    console.log('   2. Add your real credentials in checkout.js');
    console.log('   3. Test with real crypto payments!');
    console.log('==================================================');
});

