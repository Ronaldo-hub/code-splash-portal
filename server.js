
import express from 'express';
import openaiConfig from './config/openaiConfig.js';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Chatbot API endpoint
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    
    // This endpoint would typically process the message with an AI backend
    // For now, return a simple response based on the query type
    
    if (message.toLowerCase().includes('financial') && message.toLowerCase().includes('reparation')) {
        return res.json({
            response: "Financial reparations for the Khoisan mandate focus on compensating for historical land loss and economic marginalization, potentially through community funds or resource rights. Want to know more about how this is being proposed?"
        });
    }
    
    if (message.toLowerCase().includes('land') || message.toLowerCase().includes('territory')) {
        return res.json({
            response: "The Khoisan mandate calls for unconditional return of ancestral territories, including complete land ownership, mineral rights, and access to maritime resources. Archaeological evidence suggests the Khoisan have lived in Southern Africa for up to 140,000 years. Would you like to know more about the historical context?"
        });
    }
    
    if (message.toLowerCase().includes('culture') || message.toLowerCase().includes('language')) {
        return res.json({
            response: "Cultural recognition in the Khoisan mandate includes stopping the use of colonial terms like 'coloured,' officially recognizing Khoisan languages, and funding language preservation programs. Some Khoisan languages have fewer than 100 fluent speakers left. What aspects of cultural identity interest you most?"
        });
    }
    
    if (message.toLowerCase().includes('representation') || message.toLowerCase().includes('political')) {
        return res.json({
            response: "Political representation for the Khoisan involves direct parliamentary representation and veto power on legislation affecting their territories and rights. The mandate emphasizes that no laws should be enacted without explicit Khoisan community consent. How do you feel this would change current governance?"
        });
    }
    
    // Default response
    res.json({
        response: "The Khoisan mandate covers four key areas: land sovereignty, cultural recognition, political representation, and financial reparation. Which of these would you like to learn more about?"
    });
});

// Update the index.html to include the chatbot
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
