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
      id: "anthropic/claude-3-haiku",",
      name: "Claude 3 Haiku",,
      description: "Anthropic's smallest and fastest Claude model",",
      free: falsee
    },
    {
      id: "google/gemma-7b-it", id: "google/gemma-7b-it",
      name: "Gemma 7B Instruct",
      description: "Google's open model for text generation and chat (free tier)",del for text generation and chat (free tier)",
      free: true
    },
    {
      id: "mistralai/mistral-7b-instruct", id: "mistralai/mistral-7b-instruct",
      name: "Mistral 7B Instruct",
      description: "Mistral AI's 7B parameter instruction-tuned model (free tier)",I's 7B parameter instruction-tuned model (free tier)",
      free: true
    },
    {
      id: "openai/gpt-3.5-turbo", id: "openai/gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      description: "OpenAI's GPT-3.5 Turbo model (requires credits)",-3.5 Turbo model (requires credits)",
      free: false
    }
  ]
};

// X API configuration with your API keysPI keys
export const xApiConfig: XApiConfig = {
  apiKey: "cY7p1daRlWOdzy39Q8UdwpYJF",daRlWOdzy39Q8UdwpYJF",
  apiKeySecret: "4peT1FqWaMf79H07ZsfgSXx7mrUZhYKDpTV5iwN3pbgCsSccHz",eySecret: "4peT1FqWaMf79H07ZsfgSXx7mrUZhYKDpTV5iwN3pbgCsSccHz",
  accessToken: "1502572394988322818-Lm136CHUYZby3clZ5D5KSgIzJONV9u",essToken: "1502572394988322818-Lm136CHUYZby3clZ5D5KSgIzJONV9u",
  accessTokenSecret: "R32K2UBcdJTLQnCjfaLra4V6kaHvllvFU96txyeRv0NRg",LQnCjfaLra4V6kaHvllvFU96txyeRv0NRg",
  bearerToken: "AAAAAAAAAAAAAAAAAAAAAFyn0gEAAAAAoNohORWk3CUXvJeDEdN6QeIyklE%3DywkPnuAux6hjdRMLpKbJ3OSIzTb7yySz5BG6WsMdsbqmeBrWWA",AAAAAAAAAFyn0gEAAAAAoNohORWk3CUXvJeDEdN6QeIyklE%3DywkPnuAux6hjdRMLpKbJ3OSIzTb7yySz5BG6WsMdsbqmeBrWWA",
  baseUrl: "https://api.twitter.com/2"
};

// Website crawling configurationWebsite crawling configuration
export const websiteConfig = {port const websiteConfig = {
  url: "https://khoisanvoice.carrd.co/",  url: "https://khoisanvoice.carrd.co/",
  refreshInterval: 24 * 60 * 60 * 1000, // 24 hours/ 24 hours
};

// RAG configuration
export const ragConfig = {
  // Weighting for different data sources in the retrieval process
  sourceWeights: {
    website: 0.7, // 70% weight for website contentbsite content
    twitter: 0.3,  // 30% weight for Twitter content  twitter: 0.3,  // 30% weight for Twitter content
  },  },
  chunkSize: 512, // Size of text chunks for indexing chunks for indexing
  topK: 5, // Number of chunks to retrieve for each query to retrieve for each query
};

// Function to validate OpenRouter API key format Function to validate OpenRouter API key format
export const validateOpenRouterKey = (apiKey: string): { valid: boolean; message?: string } => {export const validateOpenRouterKey = (apiKey: string): { valid: boolean; message?: string } => {
  if (!apiKey || apiKey.trim() === "") {Key.trim() === "") {
    return { valid: false, message: "API key is empty" }; message: "API key is empty" };
  }
  
  const trimmedKey = apiKey.trim();
  
  if (!trimmedKey.startsWith("sk-or-v1-")) { (!trimmedKey.startsWith("sk-or-v1-")) {
    return { valid: false, message: "API key must start with 'sk-or-v1-'" };rt with 'sk-or-v1-'" };
  }
  
  if (trimmedKey.includes(" ") || trimmedKey.includes("\n")) {  if (trimmedKey.includes(" ") || trimmedKey.includes("\n")) {
    return { valid: false, message: "API key contains whitespace" };ains whitespace" };
  }
  
  if (trimmedKey.length < 30) {
    return { valid: false, message: "API key is too short" }; return { valid: false, message: "API key is too short" };
  }}
  
  return { valid: true };return { valid: true };
};

// Function to set API credentials (would be used from a settings page)Function to set API credentials (would be used from a settings page)
export const setOpenRouterCredentials = (port const setOpenRouterCredentials = (
  apiKey: string,
  model?: string,
  temperature?: number,emperature?: number,
  maxNewTokens?: numbermaxNewTokens?: number
) => {
  // Validate API key before setting
  const validation = validateOpenRouterKey(apiKey);onst validation = validateOpenRouterKey(apiKey);
  if (!validation.valid) {if (!validation.valid) {
    console.error(`Invalid OpenRouter API key: ${validation.message}`);d OpenRouter API key: ${validation.message}`);
    throw new Error(validation.message);  throw new Error(validation.message);
  }  }
  
  // Trim whitespace to avoid common errorsrs
  const trimmedKey = apiKey.trim();y = apiKey.trim();
  console.log(`Setting OpenRouter API key: ${trimmedKey.substring(0, 10)}... (length: ${trimmedKey.length})`);tting OpenRouter API key: ${trimmedKey.substring(0, 10)}... (length: ${trimmedKey.length})`);
  
  openRouterConfig.apiKey = trimmedKey;ey = trimmedKey;
  if (model) openRouterConfig.model = model;model) openRouterConfig.model = model;
  if (temperature !== undefined) openRouterConfig.temperature = temperature;nRouterConfig.temperature = temperature;
  if (maxNewTokens) openRouterConfig.maxNewTokens = maxNewTokens; maxNewTokens;
};

// Add the missing setXApiCredentials functionnction
export const setXApiCredentials = (ort const setXApiCredentials = (
  apiKey: string,apiKey: string,
  apiKeySecret: string,
  accessToken: string,
  accessTokenSecret: string,
  bearerToken: stringbearerToken: string
) => {
  console.log("Setting X API credentials..."););
  xApiConfig.apiKey = apiKey;
  xApiConfig.apiKeySecret = apiKeySecret;
  xApiConfig.accessToken = accessToken;xApiConfig.accessToken = accessToken;
  xApiConfig.accessTokenSecret = accessTokenSecret;  xApiConfig.accessTokenSecret = accessTokenSecret;
  xApiConfig.bearerToken = bearerToken;
};

// Export all configurations for easy accesstions for easy access
export const getAllConfigurations = () => {figurations = () => {
  return {
    openRouter: openRouterConfig,outerConfig,
    xApi: xApiConfig,pi: xApiConfig,
    website: websiteConfig,
    rag: ragConfig
  };
};

// Save configurations to localStorage to persist across sessionsto persist across sessions
export const saveConfigurationsToStorage = () => {port const saveConfigurationsToStorage = () => {
  try {  try {
    localStorage.setItem('openRouterConfig', JSON.stringify(openRouterConfig)); JSON.stringify(openRouterConfig));
    localStorage.setItem('xApiConfig', JSON.stringify(xApiConfig));.stringify(xApiConfig));
    console.log("Configurations saved to localStorage");e.log("Configurations saved to localStorage");
    return true;
  } catch (error) {
    console.error('Failed to save configurations to storage:', error);o save configurations to storage:', error);
    return false;
  }
};

// Load configurations from localStorage
export const loadConfigurationsFromStorage = () => { {
  try {
    const savedOpenRouterConfig = localStorage.getItem('openRouterConfig');
    const savedXApiConfig = localStorage.getItem('xApiConfig');
    
    if (savedOpenRouterConfig) {nRouterConfig) {
      const parsedConfig = JSON.parse(savedOpenRouterConfig);onfig = JSON.parse(savedOpenRouterConfig);
      openRouterConfig.apiKey = parsedConfig.apiKey || openRouterConfig.apiKey;g.apiKey;
      openRouterConfig.model = parsedConfig.model || openRouterConfig.model;onfig.model = parsedConfig.model || openRouterConfig.model;
      openRouterConfig.temperature = parsedConfig.temperature || openRouterConfig.temperature;   openRouterConfig.temperature = parsedConfig.temperature || openRouterConfig.temperature;
      openRouterConfig.maxNewTokens = parsedConfig.maxNewTokens || openRouterConfig.maxNewTokens;    openRouterConfig.maxNewTokens = parsedConfig.maxNewTokens || openRouterConfig.maxNewTokens;
      console.log(`Loaded OpenRouter API key from storage: ${openRouterConfig.apiKey.substring(0, 10)}... (length: ${openRouterConfig.apiKey.length})`);      console.log(`Loaded OpenRouter API key from storage: ${openRouterConfig.apiKey.substring(0, 10)}... (length: ${openRouterConfig.apiKey.length})`);
    }
    
    if (savedXApiConfig) {(savedXApiConfig) {
      const parsedConfig = JSON.parse(savedXApiConfig);
      xApiConfig.apiKey = parsedConfig.apiKey || xApiConfig.apiKey;Key;
      xApiConfig.apiKeySecret = parsedConfig.apiKeySecret || xApiConfig.apiKeySecret;  xApiConfig.apiKeySecret = parsedConfig.apiKeySecret || xApiConfig.apiKeySecret;
      xApiConfig.accessToken = parsedConfig.accessToken || xApiConfig.accessToken;arsedConfig.accessToken || xApiConfig.accessToken;
      xApiConfig.accessTokenSecret = parsedConfig.accessTokenSecret || xApiConfig.accessTokenSecret;Secret || xApiConfig.accessTokenSecret;
      xApiConfig.bearerToken = parsedConfig.bearerToken || xApiConfig.bearerToken;en;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to load configurations from storage:', error);onsole.error('Failed to load configurations from storage:', error);
    return false;return false;
  }
};

// API configurationtion
export const apiConfig = {
    endpoint: process.env.USE_OPENROUTER === 'true'eepseek',
        ? 'https://api.openrouter.ai/deepseek'KEY,
        : 'https://api.openai.com/v1',
    apiKey: process.env.USE_OPENROUTER === 'true'
        ? process.env.OPENROUTER_API_KEY
        : process.env.OPENAI_API_KEY,
};
