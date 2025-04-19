import { Configuration, OpenAIApi } from 'openai';
import config from './config.js';

const openai = new OpenAIApi(
    new Configuration({
        apiKey: config.openaiApiKey,
    })
);

export async function callOpenAI(prompt) {
    try {
        const response = await openai.createCompletion({
            model: 'gpt-4.0',
            prompt,
            max_tokens: 100,
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized: Invalid or missing OpenAI API key.');
        } else {
            console.error('Error calling OpenAI API:', error.message);
        }
        throw error;
    }
}
