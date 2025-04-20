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

// Hugging Face API Configuration
interface HuggingFaceConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxNewTokens: number;
  temperature: number;
}

// Default configurations with your API keys
export const openRouterConfig: OpenRouterConfig = {
  apiKey: "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",
  baseUrl: "https://openrouter.ai/api/v1/chat/completions",
  model: "meta-llama/llama-3.1-8b-instruct",
  maxNewTokens: 500,
  temperature: 0.7,
  availableModels: [
    {
      id: "deepseek/deepseek-chat",
      name: "Deepseek Chat",
      description: "Deepseek's conversational model (free tier)",
      free: true
    },
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

// Function to validate OpenRouter API key format
export const validateOpenRouterKey = (apiKey: string): { valid: boolean; message?: string } => {
  if (!apiKey || apiKey.trim() === "") {
    return { valid: false, message: "API key is empty" };
  }
  
  const trimmedKey = apiKey.trim();
  
  if (!trimmedKey.startsWith("sk-or-v1-")) {
    return { valid: false, message: "API key must start with 'sk-or-v1-'" };
  }
  
  if (trimmedKey.includes(" ") || trimmedKey.includes("\n")) {
    return { valid: false, message: "API key contains whitespace" };
  }
  
  if (trimmedKey.length < 30) {
    return { valid: false, message: "API key is too short" };
  }
  
  return { valid: true };
};

// Function to set API credentials (would be used from a settings page)
export const setOpenRouterCredentials = (
  apiKey: string,
  model?: string,
  temperature?: number,
  maxNewTokens?: number
) => {
  // Validate API key before setting
  const validation = validateOpenRouterKey(apiKey);
  if (!validation.valid) {
    console.error(`Invalid OpenRouter API key: ${validation.message}`);
    throw new Error(validation.message);
  }
  
  // Trim whitespace to avoid common errors
  const trimmedKey = apiKey.trim();
  console.log(`Setting OpenRouter API key: ${trimmedKey.substring(0, 10)}... (length: ${trimmedKey.length})`);
  
  openRouterConfig.apiKey = trimmedKey;
  if (model) openRouterConfig.model = model;
  if (temperature !== undefined) openRouterConfig.temperature = temperature;
  if (maxNewTokens) openRouterConfig.maxNewTokens = maxNewTokens;
};

// Add the missing setXApiCredentials function
export const setXApiCredentials = (
  apiKey: string,
  apiKeySecret: string,
  accessToken: string,
  accessTokenSecret: string,
  bearerToken: string
) => {
  console.log("Setting X API credentials...");
  xApiConfig.apiKey = apiKey;
  xApiConfig.apiKeySecret = apiKeySecret;
  xApiConfig.accessToken = accessToken;
  xApiConfig.accessTokenSecret = accessTokenSecret;
  xApiConfig.bearerToken = bearerToken;
};

// Add a function to set Hugging Face credentials
export const setHuggingFaceCredentials = (
  apiKey: string,
  model?: string,
  temperature?: number,
  maxNewTokens?: number
) => {
  // Validate API key before setting
  if (!apiKey || apiKey.trim() === "") {
    console.error("Invalid Hugging Face API key");
    throw new Error("API key cannot be empty");
  }
  
  // Trim whitespace to avoid common errors
  const trimmedKey = apiKey.trim();
  console.log(`Setting Hugging Face API key: ${trimmedKey.substring(0, 10)}... (length: ${trimmedKey.length})`);
  
  huggingFaceConfig.apiKey = trimmedKey;
  if (model) huggingFaceConfig.model = model;
  if (temperature !== undefined) huggingFaceConfig.temperature = temperature;
  if (maxNewTokens) huggingFaceConfig.maxNewTokens = maxNewTokens;
};

// Hugging Face API configuration
export const huggingFaceConfig: HuggingFaceConfig = {
  apiKey: '', // You'll need to set this 
  baseUrl: 'https://api-inference.huggingface.co/models/',
  model: 'distilbert-base-uncased-finetuned-sst-2-english', // Example model, replace with your preferred model
  maxNewTokens: 150,
  temperature: 0.7
};

// Export all configurations for easy access
export const getAllConfigurations = () => {
  return {
    openRouter: openRouterConfig,
    xApi: xApiConfig,
    website: websiteConfig,
    rag: ragConfig,
    huggingFace: huggingFaceConfig
  };
};

// Save configurations to localStorage to persist across sessions
export const saveConfigurationsToStorage = () => {
  try {
    localStorage.setItem('openRouterConfig', JSON.stringify(openRouterConfig));
    localStorage.setItem('xApiConfig', JSON.stringify(xApiConfig));
    localStorage.setItem('huggingFaceConfig', JSON.stringify(huggingFaceConfig));
    console.log("Configurations saved to localStorage");
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
    const savedHuggingFaceConfig = localStorage.getItem('huggingFaceConfig');
    
    if (savedOpenRouterConfig) {
      const parsedConfig = JSON.parse(savedOpenRouterConfig);
      openRouterConfig.apiKey = parsedConfig.apiKey || openRouterConfig.apiKey;
      openRouterConfig.model = parsedConfig.model || openRouterConfig.model;
      openRouterConfig.temperature = parsedConfig.temperature || openRouterConfig.temperature;
      openRouterConfig.maxNewTokens = parsedConfig.maxNewTokens || openRouterConfig.maxNewTokens;
      console.log(`Loaded OpenRouter API key from storage: ${openRouterConfig.apiKey.substring(0, 10)}... (length: ${openRouterConfig.apiKey.length})`);
    }
    
    if (savedXApiConfig) {
      const parsedConfig = JSON.parse(savedXApiConfig);
      xApiConfig.apiKey = parsedConfig.apiKey || xApiConfig.apiKey;
      xApiConfig.apiKeySecret = parsedConfig.apiKeySecret || xApiConfig.apiKeySecret;
      xApiConfig.accessToken = parsedConfig.accessToken || xApiConfig.accessToken;
      xApiConfig.accessTokenSecret = parsedConfig.accessTokenSecret || xApiConfig.accessTokenSecret;
      xApiConfig.bearerToken = parsedConfig.bearerToken || xApiConfig.bearerToken;
    }
    
    if (savedHuggingFaceConfig) {
      const parsedConfig = JSON.parse(savedHuggingFaceConfig);
      huggingFaceConfig.apiKey = parsedConfig.apiKey || huggingFaceConfig.apiKey;
      huggingFaceConfig.model = parsedConfig.model || huggingFaceConfig.model;
      huggingFaceConfig.temperature = parsedConfig.temperature || huggingFaceConfig.temperature;
      huggingFaceConfig.maxNewTokens = parsedConfig.maxNewTokens || huggingFaceConfig.maxNewTokens;
      
      console.log(`Loaded Hugging Face API key from storage: ${huggingFaceConfig.apiKey.substring(0, 10)}... (length: ${huggingFaceConfig.apiKey.length})`);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to load configurations from storage:', error);
    return false;
  }
};

// API configuration
export const apiConfig = {
    endpoint: process.env.USE_OPENROUTER === 'true'
        ? 'https://api.openrouter.ai/deepseek'
        : 'https://api.openai.com/v1',
    apiKey: process.env.USE_OPENROUTER === 'true'
        ? process.env.OPENROUTER_API_KEY
        : process.env.OPENAI_API_KEY,
};
