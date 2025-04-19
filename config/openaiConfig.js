import dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error("Error: OpenAI API key is missing. Please set the OPENAI_API_KEY environment variable.");
    process.exit(1); // Exit the process to prevent the server from starting
}

export default {
    apiKey: OPENAI_API_KEY,
};
