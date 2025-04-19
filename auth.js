const { api } = require('./config');
const logger = require('./logger'); // Assume a logger module exists

function getApiKey() {
    if (!api.apiKey) {
        logger.error('API key is missing. Ensure it is set in the environment variables.');
        throw new Error('API key is missing.');
    }
    return api.apiKey;
}

module.exports = { getApiKey };
