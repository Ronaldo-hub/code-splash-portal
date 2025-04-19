import dotenv from 'dotenv';

dotenv.config();

const config = {
    openaiApiKey: process.env.OPENAI_API_KEY,
    api: {
        endpoint: process.env.OPENROUTER_API_ENDPOINT || 'https://api.openrouter.ai/deepseek',
        modelId: process.env.OPENROUTER_MODEL_ID || 'deepseek-model-id',
        apiKey: process.env.OPENROUTER_API_KEY,
    },
};

if (!config.openaiApiKey) {
    throw new Error('OpenAI API key is missing. Please set the OPENAI_API_KEY environment variable.');
}

export default config;