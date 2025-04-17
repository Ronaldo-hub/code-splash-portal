
// Configuration for external APIs - In production, use environment variables

// OpenRouter Configuration
interface OpenRouterConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxNewTokens: number;
  temperature: number;
}

// X Developer API Configuration
interface XApiConfig {
  apiKey: string;
  apiKeySecret: string;
  accessToken: string;
  accessTokenSecret: string;
  bearerToken: string;
  baseUrl: string;
}

// Default configurations - these should be replaced with real credentials
export const openRouterConfig: OpenRouterConfig = {
  apiKey: "", // Will be provided by user
  baseUrl: "https://openrouter.ai/api/v1/chat/completions",
  model: "meta-llama/llama-3.1-8b-instruct",
  maxNewTokens: 300,
  temperature: 0.7
};

// X API configuration
export const xApiConfig: XApiConfig = {
  apiKey: "", // Will be provided by user
  apiKeySecret: "", // Will be provided by user
  accessToken: "", // Will be provided by user
  accessTokenSecret: "", // Will be provided by user
  bearerToken: "", // Will be provided by user
  baseUrl: "https://api.twitter.com/2"
};

// Website crawling configuration
export const websiteConfig = {
  url: "https://khoisanvoice.carrd.co/",
  refreshInterval: 24 * 60 * 60 * 1000, // 24 hours
};

// Function to set API credentials (would be used from a settings page)
export const setOpenRouterCredentials = (
  apiKey: string,
  model?: string,
  temperature?: number
) => {
  openRouterConfig.apiKey = apiKey;
  if (model) openRouterConfig.model = model;
  if (temperature !== undefined) openRouterConfig.temperature = temperature;
};

export const setXApiCredentials = (
  apiKey: string,
  apiKeySecret: string,
  accessToken: string,
  accessTokenSecret: string,
  bearerToken: string
) => {
  xApiConfig.apiKey = apiKey;
  xApiConfig.apiKeySecret = apiKeySecret;
  xApiConfig.accessToken = accessToken;
  xApiConfig.accessTokenSecret = accessTokenSecret;
  xApiConfig.bearerToken = bearerToken;
};
