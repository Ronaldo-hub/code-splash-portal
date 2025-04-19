import https from 'https';

const endpoint = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; // Make sure this is set in your .env or Codespaces secrets

const requestBody = JSON.stringify({
    model: "deepseek-chat",
    messages: [
        { role: "user", content: "Hello! Can you respond to this?" }
    ]
});

const options = {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': requestBody.length
    }
};

function testConnection(url, retries = 3, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const attempt = (retryCount) => {
            const req = https.request(url, options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        resolve(`✅ Connected successfully to ${url}\nResponse: ${data}`);
                    } else {
                        reject(new Error(`❌ Status code: ${res.statusCode}\nBody: ${data}`));
                    }
                });
            });

            req.on('error', (err) => {
                if (retryCount > 0) {
                    console.log(`Retrying ${url} (${retries - retryCount + 1}/${retries})...`);
                    attempt(retryCount - 1);
                } else {
                    reject(new Error(`Could not connect to ${url}\nMessage: ${err.message}`));
                }
            });

            req.setTimeout(timeout, () => {
                req.destroy();
                if (retryCount > 0) {
                    console.log(`Retrying ${url} due to timeout (${retries - retryCount + 1}/${retries})...`);
                    attempt(retryCount - 1);
                } else {
                    reject(new Error(`Connection to ${url} timed out after ${timeout}ms`));
                }
            });

            req.write(requestBody);
            req.end();
        };
        attempt(retries);
    });
}

(async () => {
    try {
        const result = await testConnection(endpoint);
        console.log(result);
    } catch (error) {
        console.error(error.message);
    }
})();
