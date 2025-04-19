const axios = require('axios');
const { api } = require('./config');
const { getApiKey } = require('./auth');
const logger = require('./logger'); // Assume a logger module exists

const apiClient = axios.create({
    baseURL: api.endpoint,
    headers: {
        'Authorization': `Bearer ${getApiKey()}`,
    },
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        logger.error(`API request failed: ${error.message}`, {
            status: error.response?.status,
            data: error.response?.data,
        });
        return Promise.reject(error);
    }
);

module.exports = apiClient;
