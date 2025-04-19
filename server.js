import express from 'express';
import openaiConfig from './config/openaiConfig.js';

const app = express();

// Middleware to validate OpenAI API key
app.use((req, res, next) => {
    if (!openaiConfig.apiKey) {
        return res.status(500).json({ error: "OpenAI API key is not configured properly." });
    }
    next();
});

// ...existing code...

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});