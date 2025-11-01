// ===============================================
// CRYPTOMUS PAYMENT PROXY SERVER
// This backend handles Cryptomus API calls
// ===============================================

const http = require('http');
const https = require('https');
const crypto = require('crypto');

// Configuration
const PORT = 3000;
const CRYPTOMUS_CONFIG = {
    merchantId: '8ca4881f-0c2a-44d2-8b69-5bca0fcc4189',
    apiKey: 'c4fc5716f8249e39b75eb310ff9c01058bdcc52d',
    apiUrl: 'api.cryptomus.com',
    apiPath: '/v1/payment'
};

// Generate MD5 signature for Cryptomus
function generateSignature(data, apiKey) {
    const jsonString = JSON.stringify(data);
    const base64Data = Buffer.from(jsonString).toString('base64');
    const signature = crypto.createHash('md5').update(base64Data + apiKey).digest('hex');
    return signature;
}

// Handle CORS
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Create HTTP server
const server = http.createServer((req, res) => {
    setCorsHeaders(res);

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Only handle POST to /create-payment
    if (req.method === 'POST' && req.url === '/create-payment') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const requestData = JSON.parse(body);
                console.log('📦 Received payment request:', requestData);

                // Prepare Cryptomus payment data
                const paymentData = {
                    amount: requestData.amount.toString(),
                    currency: requestData.currency,
                    order_id: requestData.order_id,
                    url_return: requestData.url_return,
                    lifetime: 3600,
                    to_currency: 'BTC',
                    additional_data: JSON.stringify({
                        customer_name: requestData.customer_name,
                        customer_email: requestData.customer_email,
                        plan: requestData.plan
                    })
                };

                console.log('📦 Payment data prepared:', paymentData);

                // Generate signature
                const signature = generateSignature(paymentData, CRYPTOMUS_CONFIG.apiKey);
                console.log('🔐 Signature:', signature);

                // Prepare request to Cryptomus
                const postData = JSON.stringify(paymentData);
                const options = {
                    hostname: CRYPTOMUS_CONFIG.apiUrl,
                    path: CRYPTOMUS_CONFIG.apiPath,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(postData),
                        'merchant': CRYPTOMUS_CONFIG.merchantId,
                        'sign': signature
                    }
                };

                console.log('📡 Calling Cryptomus API...');

                // Make request to Cryptomus
                const cryptomusReq = https.request(options, (cryptomusRes) => {
                    let responseData = '';

                    cryptomusRes.on('data', chunk => {
                        responseData += chunk;
                    });

                    cryptomusRes.on('end', () => {
                        console.log('📨 Cryptomus response status:', cryptomusRes.statusCode);
                        console.log('📨 Cryptomus response:', responseData);

                        try {
                            const result = JSON.parse(responseData);
                            
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(result));
                        } catch (error) {
                            console.error('❌ Error parsing Cryptomus response:', error);
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({
                                success: false,
                                error: 'Invalid response from Cryptomus'
                            }));
                        }
                    });
                });

                cryptomusReq.on('error', (error) => {
                    console.error('❌ Cryptomus API error:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: error.message
                    }));
                });

                cryptomusReq.write(postData);
                cryptomusReq.end();

            } catch (error) {
                console.error('❌ Server error:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: error.message
                }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

server.listen(PORT, () => {
    console.log('=====================================');
    console.log('🚀 Cryptomus Proxy Server Started!');
    console.log('=====================================');
    console.log(`Server running at: http://localhost:${PORT}`);
    console.log(`Endpoint: http://localhost:${PORT}/create-payment`);
    console.log('');
    console.log('✅ Ready to receive payment requests');
    console.log('=====================================');
});

