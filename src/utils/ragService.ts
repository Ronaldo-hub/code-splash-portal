
import axios from "axios";
import { vectorDb } from "./vectorDb";
import { toast } from "sonner";
import { openRouterConfig, ragConfig } from "./apiConfig";
import { GenerationOptions } from "./types/ragTypes";
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
      if (!openRouterConfig.apiKey || openRouterConfig.apiKey.trim() === "") {
        console.log("No API key configured for OpenRouter");
        return "I need to be configured with a valid API key to help you better. Please check the settings.";
      }
      
      console.log(`Using API key: ${openRouterConfig.apiKey.substring(0, 10)}...`);
      
      if (GreetingHandler.isGreeting(query.toLowerCase().trim())) {
        return GreetingHandler.getGreetingResponse();
      }
      
      const relevantDocs = await vectorDb.similaritySearch(query, ragConfig.topK || 5);
      
      if (relevantDocs.length === 0) {
        return FallbackHandler.getContextualFallback(query.toLowerCase().trim());
      }
      
      const context = relevantDocs
        .map(doc => `${doc.text} (Source: ${doc.source})`)
        .join("\n\n");
      
      const ragPrompt = ResponseFormatter.createRagPrompt(context, query);
      
      console.log("Sending request to OpenRouter API...");
      console.log(`Using model: ${openRouterConfig.model}`);
      
      const response = await axios.post(
        openRouterConfig.baseUrl,
        {
          model: openRouterConfig.model,
          messages: [
            { role: "system", content: "You are a helpful assistant for the Khoisan Voice initiative." },
            { role: "user", content: ragPrompt }
          ],
          max_tokens: options.max_new_tokens || openRouterConfig.maxNewTokens,
          temperature: options.temperature || openRouterConfig.temperature,
        },
        {
          headers: {
            "Authorization": `Bearer ${openRouterConfig.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.href,
            "X-Title": "Khoisan Voice Assistant"
          }
        }
      );
      
      if (response.data.choices && response.data.choices.length > 0) {
        const generatedText = response.data.choices[0].message.content.trim();
        return ResponseFormatter.ensureCitations(generatedText, relevantDocs);
      } else {
        console.log("No response generated from OpenRouter");
        return "I couldn't generate a response at this time. Please try again later or visit https://khoisanvoice.carrd.co/ for more information about the Khoisan Voice initiative.";
      }
    } catch (error) {
      console.error("Error generating response:", error);
      
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.error?.message || error.message;
        
        console.error(`API error: ${statusCode} - ${errorMessage}`);
        
        if (statusCode === 401 || statusCode === 403) {
          return "Authentication error with OpenRouter API. Please check your API key in the settings. Make sure it starts with 'sk-or-v1-'.";
        } else if (statusCode === 429) {
          return "Rate limit exceeded. Please try again later or consider upgrading your OpenRouter plan.";
        } else {
          console.error(`OpenRouter API error: ${errorMessage}`);
          return `Error connecting to the AI service. Please try again later. (Error: ${statusCode || 'Unknown'})`;
        }
      }
      
      try {
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
