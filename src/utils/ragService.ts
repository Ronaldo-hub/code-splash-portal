
import axios from "axios";
import { vectorDb } from "./vectorDb";
import { toast } from "sonner";
import { openRouterConfig, ragConfig } from "./apiConfig";
import { GenerationOptions, DocumentWithSource } from "./types/ragTypes";
import { GreetingHandler } from "./handlers/greetingHandler";
import { ResponseFormatter } from "./handlers/responseFormatter";
import { FallbackHandler } from "./handlers/fallbackHandler";

export class RagService {
  private isModelLoading: boolean = false;
  
  public isLoading(): boolean {
    return this.isModelLoading;
  }
  
  public async generateResponse(query: string, options: GenerationOptions = {}): Promise<string> {
    try {
      // Validate API key
      if (!openRouterConfig.apiKey || openRouterConfig.apiKey.trim() === "") {
        console.error("No API key configured for OpenRouter");
        return "I need to be configured with a valid API key to help you better. Please check the settings.";
      }
      
      // Log API key (first 10 chars) for debugging
      console.log(`Using API key: ${openRouterConfig.apiKey.substring(0, 10)}...`);
      console.log(`Full API key length: ${openRouterConfig.apiKey.length} characters`);
      
      // Check if the query is a greeting
      if (GreetingHandler.isGreeting(query.toLowerCase().trim())) {
        console.log("Detected greeting, using greeting handler");
        return GreetingHandler.getGreetingResponse();
      }
      
      // Retrieve relevant documents
      console.log(`Searching vector DB for query: "${query}"`);
      const relevantDocs = await vectorDb.similaritySearch(query, ragConfig.topK || 5);
      console.log(`Found ${relevantDocs.length} relevant documents`);
      
      if (relevantDocs.length === 0) {
        console.log("No relevant documents found, using fallback handler");
        return FallbackHandler.getContextualFallback(query.toLowerCase().trim());
      }
      
      // Format context for prompt
      const context = relevantDocs
        .map(doc => `${doc.text} (Source: ${doc.source})`)
        .join("\n\n");
      
      // Create RAG prompt
      const ragPrompt = ResponseFormatter.createRagPrompt(context, query);
      
      console.log("Sending request to OpenRouter API...");
      console.log(`Using model: ${openRouterConfig.model}`);
      console.log(`API Base URL: ${openRouterConfig.baseUrl}`);
      
      // Prepare request configuration with detailed headers
      const requestConfig = {
        headers: {
          "Authorization": `Bearer ${openRouterConfig.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.href,
          "X-Title": "Khoisan Voice Assistant"
        }
      };
      
      // Log request configuration (without sensitive data)
      console.log("Request headers:", {
        "Content-Type": requestConfig.headers["Content-Type"],
        "HTTP-Referer": requestConfig.headers["HTTP-Referer"],
        "X-Title": requestConfig.headers["X-Title"],
        "Authorization": "Bearer [REDACTED]"
      });
      
      // Prepare request body
      const requestBody = {
        model: openRouterConfig.model,
        messages: [
          { role: "system", content: "You are a helpful assistant for the Khoisan Voice initiative." },
          { role: "user", content: ragPrompt }
        ],
        max_tokens: options.max_new_tokens || openRouterConfig.maxNewTokens,
        temperature: options.temperature || openRouterConfig.temperature,
      };
      
      // Log request body (excluding the full prompt)
      console.log("Request body:", {
        model: requestBody.model,
        max_tokens: requestBody.max_tokens,
        temperature: requestBody.temperature,
        messages: [
          { role: "system", content: "[SYSTEM PROMPT]" },
          { role: "user", content: "[USER QUERY]" }
        ]
      });
      
      // Make API request with timeout
      const response = await axios.post(
        openRouterConfig.baseUrl,
        requestBody,
        {
          ...requestConfig,
          timeout: 30000 // 30 second timeout
        }
      );
      
      console.log("Received response from OpenRouter API");
      console.log("Response status:", response.status);
      
      if (response.data.choices && response.data.choices.length > 0) {
        const generatedText = response.data.choices[0].message.content.trim();
        console.log("Generated response length:", generatedText.length);
        return ResponseFormatter.ensureCitations(generatedText, relevantDocs);
      } else {
        console.error("No valid response content in API response:", response.data);
        return "I couldn't generate a response at this time. Please try again later or visit https://khoisanvoice.carrd.co/ for more information about the Khoisan Voice initiative.";
      }
    } catch (error) {
      console.error("Error generating response:", error);
      
      if (axios.isAxiosError(error)) {
        // Enhanced error logging for Axios errors
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.error?.message || error.message;
        const errorType = error.response?.data?.error?.type;
        const errorCode = error.code;
        
        console.error(`API error details:
          Status: ${statusCode}
          Message: ${errorMessage}
          Type: ${errorType}
          Code: ${errorCode}
          Response data: ${JSON.stringify(error.response?.data || {})}
        `);
        
        if (statusCode === 401 || statusCode === 403) {
          const keyLength = openRouterConfig.apiKey.length;
          const keyStart = openRouterConfig.apiKey.substring(0, 10);
          console.error(`Authentication error with key starting with ${keyStart}... (length: ${keyLength})`);
          return `Authentication error with OpenRouter API. Please check your API key in the settings. Make sure it starts with 'sk-or-v1-'. Current key starts with: ${keyStart}...`;
        } else if (statusCode === 429) {
          return "Rate limit exceeded. Please try again later or consider upgrading your OpenRouter plan.";
        } else if (error.code === 'ECONNABORTED') {
          return "The request to the AI service timed out. Please try again.";
        } else if (error.code === 'ERR_NETWORK') {
          return "Network error when connecting to the AI service. Please check your internet connection and try again.";
        } else {
          console.error(`OpenRouter API error: ${errorMessage}`);
          return `Error connecting to the AI service. Please try again later. (Error: ${statusCode || errorCode || 'Unknown'})`;
        }
      }
      
      try {
        console.log("Trying to generate fallback response...");
        const fallbackDocs = await vectorDb.similaritySearch(query, ragConfig.topK || 5);
        return FallbackHandler.getFallbackResponse(query, fallbackDocs);
      } catch (fallbackError) {
        console.error("Error generating fallback response:", fallbackError);
        return FallbackHandler.getFallbackResponse(query, []);
      }
    }
  }
}

export const ragService = new RagService();
