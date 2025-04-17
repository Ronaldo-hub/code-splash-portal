
// Configuration for external APIs - In production, use environment variables

// OpenRouter Configuration
interface OpenRouterConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxNewTokens: number;
  temperature: number;
  // Available models for selection
  availableModels: {
    id: string;
    name: string;
    description: string;
    free: boolean;
  }[];
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

// Default configurations with your API keys
export const openRouterConfig: OpenRouterConfig = {
  apiKey: "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",
  baseUrl: "https://openrouter.ai/api/v1/chat/completions",
  model: "meta-llama/llama-3.1-8b-instruct",
  maxNewTokens: 300,
  temperature: 0.7,
  availableModels: [
    {
      id: "meta-llama/llama-3.1-8b-instruct",
      name: "Llama 3.1 8B Instruct",
      description: "Meta's Llama 3.1 8B model, optimized for chat instructions (free tier)",
      free: true
    },
    {
      id: "anthropic/claude-3-haiku",
      name: "Claude 3 Haiku",
      description: "Anthropic's smallest and fastest Claude model",
      free: false
    },
    {
      id: "google/gemma-7b-it",
      name: "Gemma 7B Instruct",
      description: "Google's open model for text generation and chat (free tier)",
      free: true
    },
    {
      id: "mistralai/mistral-7b-instruct",
      name: "Mistral 7B Instruct",
      description: "Mistral AI's 7B parameter instruction-tuned model (free tier)",
      free: true
    },
    {
      id: "openai/gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      description: "OpenAI's GPT-3.5 Turbo model (requires credits)",
      free: false
    }
  ]
};

// X API configuration with your API keys
export const xApiConfig: XApiConfig = {
  apiKey: "cY7p1daRlWOdzy39Q8UdwpYJF",
  apiKeySecret: "4peT1FqWaMf79H07ZsfgSXx7mrUZhYKDpTV5iwN3pbgCsSccHz",
  accessToken: "1502572394988322818-Lm136CHUYZby3clZ5D5KSgIzJONV9u",
  accessTokenSecret: "R32K2UBcdJTLQnCjfaLra4V6kaHvllvFU96txyeRv0NRg",
  bearerToken: "AAAAAAAAAAAAAAAAAAAAAFyn0gEAAAAAoNohORWk3CUXvJeDEdN6QeIyklE%3DywkPnuAux6hjdRMLpKbJ3OSIzTb7yySz5BG6WsMdsbqmeBrWWA",
  baseUrl: "https://api.twitter.com/2"
};

// Website crawling configuration
export const websiteConfig = {
  url: "https://khoisanvoice.carrd.co/",
  refreshInterval: 24 * 60 * 60 * 1000, // 24 hours
};

// RAG configuration
export const ragConfig = {
  // Weighting for different data sources in the retrieval process
  sourceWeights: {
    website: 0.7, // 70% weight for website content
    twitter: 0.3,  // 30% weight for Twitter content
  },
  chunkSize: 512, // Size of text chunks for indexing
  topK: 5, // Number of chunks to retrieve for each query
};

// Function to set API credentials (would be used from a settings page)
export const setOpenRouterCredentials = (
  apiKey: string,
  model?: string,
  temperature?: number,
  maxNewTokens?: number
) => {
  openRouterConfig.apiKey = apiKey;
  if (model) openRouterConfig.model = model;
  if (temperature !== undefined) openRouterConfig.temperature = temperature;
  if (maxNewTokens) openRouterConfig.maxNewTokens = maxNewTokens;
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

// Export all configurations for easy access
export const getAllConfigurations = () => {
  return {
    openRouter: openRouterConfig,
    xApi: xApiConfig,
    website: websiteConfig,
    rag: ragConfig
  };
};

// Save configurations to localStorage to persist across sessions
export const saveConfigurationsToStorage = () => {
  try {
    localStorage.setItem('openRouterConfig', JSON.stringify(openRouterConfig));
    localStorage.setItem('xApiConfig', JSON.stringify(xApiConfig));
    return true;
  } catch (error) {
    console.error('Failed to save configurations to storage:', error);
    return false;
  }
};

// Load configurations from localStorage
export const loadConfigurationsFromStorage = () => {
  try {
    const savedOpenRouterConfig = localStorage.getItem('openRouterConfig');
    const savedXApiConfig = localStorage.getItem('xApiConfig');
    
    if (savedOpenRouterConfig) {
      const parsedConfig = JSON.parse(savedOpenRouterConfig);
      openRouterConfig.apiKey = parsedConfig.apiKey || openRouterConfig.apiKey;
      openRouterConfig.model = parsedConfig.model || openRouterConfig.model;
      openRouterConfig.temperature = parsedConfig.temperature || openRouterConfig.temperature;
      openRouterConfig.maxNewTokens = parsedConfig.maxNewTokens || openRouterConfig.maxNewTokens;
    }
    
    if (savedXApiConfig) {
      const parsedConfig = JSON.parse(savedXApiConfig);
      xApiConfig.apiKey = parsedConfig.apiKey || xApiConfig.apiKey;
      xApiConfig.apiKeySecret = parsedConfig.apiKeySecret || xApiConfig.apiKeySecret;
      xApiConfig.accessToken = parsedConfig.accessToken || xApiConfig.accessToken;
      xApiConfig.accessTokenSecret = parsedConfig.accessTokenSecret || xApiConfig.accessTokenSecret;
      xApiConfig.bearerToken = parsedConfig.bearerToken || xApiConfig.bearerToken;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to load configurations from storage:', error);
    return false;
  }
};
