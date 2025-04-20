import express from 'express';
import openaiConfig from './config/openaiConfig.js';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.json());

// Middleware to validate OpenAI API key
app.use((req, res, next) => {
    if (!openaiConfig.apiKey) {
        return res.status(500).json({ error: "OpenAI API key is not configured properly." });
    }
    next();
});

// API endpoints for the voting system
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'Backend is running',
        wallet_address: '0x1234567890abcdef'
    });
});

app.get('/api/vote-count', (req, res) => {
    res.json({ 
        success: true,
        vote_count: Math.floor(Math.random() * 100) 
    });
});

app.post('/api/fund-voter/:walletAddress', (req, res) => {
    const walletAddress = req.params.walletAddress;
    
    // Simulate funding success
    res.json({
        success: true,
        txid: `tx-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    });
});

app.post('/cast-vote', (req, res) => {
    const { voter_credentials, proposal_name, voting_power, asset_id } = req.body;
    
    if (!voter_credentials || !proposal_name || !voting_power) {
        return res.json({ error: 'Missing required fields' });
    }
    
    // Simulate successful vote
    res.json({
        success: true,
        message: 'Vote cast successfully'
    });
});

// Serve the Meraki portal page
app.get('/splash', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

// Configuration for the Hugging Face API
const HUGGINGFACE_CONFIG = {
    apiKey: process.env.HUGGINGFACE_API_KEY || '',
    model: 'meta-llama/llama-3.1-8b-instruct', // You can change to a different model
    apiUrl: 'https://api-inference.huggingface.co/models/',
    maxTokens: 150,
    temperature: 0.7
};

// Khoisan mandate information to inform the AI responses
const KHOISAN_CONTEXT = `
The Khoisan First Nations mandate focuses on four key areas:

1. Land Sovereignty: Unconditional return of ancestral territories, complete land ownership, mineral extraction rights, and access to maritime resources. Archaeological evidence suggests the Khoisan have lived in Southern Africa for 140,000 years.

2. Cultural Recognition: Stopping the use of colonial terms like 'coloured', official recognition of Khoisan languages as national languages, and state-funded language preservation programs. Some Khoisan languages have fewer than 100 fluent speakers remaining.

3. Political Representation: Direct, proportional parliamentary representation, absolute veto power on legislation affecting Khoisan territories and rights. No agreements, treaties, or laws should be enacted without explicit, documented Khoisan community consent.

4. Financial Reparation: Dedicated national fund for Khoisan community development, transparent mechanisms to compensate for centuries of economic marginalization and land dispossession.

This mandate is a non-negotiable assertion of indigenous rights and sovereignty.
`;

// Helper function to determine if a message is about a specific topic
function detectTopic(message) {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('land') || messageLower.includes('territory') || messageLower.includes('ancestral')) {
        return 'land_sovereignty';
    }
    
    if (messageLower.includes('culture') || messageLower.includes('language') || messageLower.includes('identity')) {
        return 'cultural_recognition';
    }
    
    if (messageLower.includes('representation') || messageLower.includes('parliament') || messageLower.includes('political')) {
        return 'political_representation';
    }
    
    if (messageLower.includes('financial') || messageLower.includes('reparation') || messageLower.includes('economic')) {
        return 'financial_reparation';
    }
    
    if (messageLower.includes('wifi') || messageLower.includes('connect') || messageLower.includes('internet')) {
        return 'wifi_connection';
    }
    
    return null;
}

// Enhanced chatbot API endpoint using Hugging Face
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    
    // Track conversation context using session if available
    const conversationHistory = req.session?.conversationHistory || [];
    
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    
    try {
        // First, try to use rule-based responses for common queries
        // This acts as a fallback if the Hugging Face API is unavailable or returns low-quality responses
        
        const topic = detectTopic(message);
        
        // Generate a prompt for Hugging Face based on the detected topic
        const promptPrefix = topic ? `The user is asking about the Khoisan mandate's ${topic.replace('_', ' ')}. ` : '';
        
        const prompt = `${promptPrefix}Based on this context about the Khoisan mandate:
${KHOISAN_CONTEXT}

And this conversation history:
${conversationHistory.map(item => `${item.role}: ${item.content}`).join('\n')}

Please respond to this user question in a warm, conversational tone:
"${message}"

Your response should:
1. Be friendly and natural (use phrases like "That's a great question!" or "I'd be happy to explain")
2. Directly address the user's specific question
3. Provide information from the Khoisan mandate context above
4. End with a follow-up question to encourage conversation
5. Avoid stiff or promotional language

Response:`;
        
        // If Hugging Face API key is available, use it
        if (HUGGINGFACE_CONFIG.apiKey) {
            try {
                const response = await axios({
                    method: 'POST',
                    url: `${HUGGINGFACE_CONFIG.apiUrl}${HUGGINGFACE_CONFIG.model}`,
                    headers: {
                        'Authorization': `Bearer ${HUGGINGFACE_CONFIG.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        inputs: prompt,
                        parameters: {
                            max_new_tokens: HUGGINGFACE_CONFIG.maxTokens,
                            temperature: HUGGINGFACE_CONFIG.temperature,
                            return_full_text: false
                        }
                    },
                    timeout: 30000 // 30-second timeout
                });
                
                // If successful, use the Hugging Face response
                if (response.data && response.data[0] && response.data[0].generated_text) {
                    let aiResponse = response.data[0].generated_text.trim();
                    
                    // Update conversation history if using sessions
                    if (req.session) {
                        // Add the user message
                        conversationHistory.push({ role: 'user', content: message });
                        
                        // Add the bot response
                        conversationHistory.push({ role: 'assistant', content: aiResponse });
                        
                        // Keep only the last 5 exchanges (10 messages)
                        req.session.conversationHistory = conversationHistory.slice(-10);
                    }
                    
                    return res.json({ response: aiResponse });
                }
            } catch (error) {
                console.error('Error calling Hugging Face API:', error.message);
                // Continue to fallback responses if API call fails
            }
        }
        
        // Fallback to rule-based responses if Hugging Face API fails or is not configured
        if (topic === 'land_sovereignty') {
            return res.json({
                response: "That's a great question about land sovereignty! The Khoisan mandate calls for the unconditional return of ancestral territories, which includes complete land ownership, mineral rights, and access to maritime resources. Archaeological evidence suggests the Khoisan have lived in Southern Africa for up to 140,000 years, making their land claims historically significant. Are you interested in hearing more about how this sovereignty would be implemented in practice?"
            });
        }
        
        if (topic === 'cultural_recognition') {
            return res.json({
                response: "I'm glad you asked about cultural recognition! This aspect of the Khoisan mandate focuses on preserving identity and heritage, including stopping the use of colonial terms like 'coloured,' officially recognizing Khoisan languages, and implementing language preservation programs. Some Khoisan languages have fewer than 100 fluent speakers remaining, which makes these efforts particularly urgent. What specific aspect of cultural preservation interests you most?"
            });
        }
        
        if (topic === 'political_representation') {
            return res.json({
                response: "Thanks for asking about political representation! For the Khoisan people, this involves direct parliamentary representation and veto power on legislation affecting their territories and rights. The mandate emphasizes that no agreements or laws should be enacted without explicit Khoisan community consent - a principle known as Free, Prior and Informed Consent. How do you feel this would change the current governance structures in the region?"
            });
        }
        
        if (topic === 'financial_reparation') {
            return res.json({
                response: "Thanks for your interest in financial reparations! The Khoisan mandate focuses on addressing historical injustices through economic compensation, including establishing community development funds, providing resource rights, and creating transparent mechanisms to compensate for centuries of marginalization. These funds would support education, healthcare, and cultural preservation initiatives. Would you like to know more about how these reparations might be implemented?"
            });
        }
        
        if (topic === 'wifi_connection') {
            return res.json({
                response: "Good question about connecting! To access the Khoisan Voice Wi-Fi network, simply enter your email address and name in the form on this page, then click 'Connect to Wi-Fi'. This is a free service while you're learning about the Khoisan mandate. Is there something specific about the Khoisan First Nations you'd like to know more about while you're connected?"
            });
        }
        
        // Default response for general or unclear queries
        return res.json({
            response: "Thanks for reaching out! The Khoisan mandate covers four key areas: land sovereignty, cultural recognition, political representation, and financial reparation. Each of these represents an important aspect of indigenous rights for the Khoisan people, who have lived in Southern Africa for approximately 140,000 years. Which of these topics would you like to explore further? I'm happy to share more specific information."
        });
        
    } catch (error) {
        console.error('Error processing chat request:', error);
        res.status(500).json({ 
            error: 'Failed to process your message',
            response: "I'm sorry, I'm having trouble processing your request right now. The Khoisan mandate covers land sovereignty, cultural recognition, political representation, and financial reparation. Which of these would you like to learn more about?"
        });
    }
});

// Update the index.html to include the chatbot
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
    // Log API configuration status
    if (HUGGINGFACE_CONFIG.apiKey) {
        console.log(`Hugging Face API configured with model: ${HUGGINGFACE_CONFIG.model}`);
    } else {
        console.log('Hugging Face API not configured, using fallback responses');
    }
});
