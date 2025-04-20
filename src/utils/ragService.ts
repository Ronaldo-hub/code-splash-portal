
import axios from "axios";
import { vectorDb } from "./vectorDb";
import { toast } from "sonner";
import { openRouterConfig, ragConfig } from "./apiConfig";
import { GenerationOptions, DocumentWithSource } from "./types/ragTypes";
import { GreetingHandler } from "./handlers/greetingHandler";
import { ResponseFormatter } from "./handlers/responseFormatter";
import { FallbackHandler } from "./handlers/fallbackHandler";
import { ConversationalHandler } from "./handlers/conversationalHandler";

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
      const trimmedApiKey = openRouterConfig.apiKey.trim();
      console.log(`Using API key: ${trimmedApiKey.substring(0, 10)}...`);
      console.log(`Full API key length: ${trimmedApiKey.length} characters`);
      
      // Check if the query is a greeting
      if (GreetingHandler.isGreeting(query.toLowerCase().trim())) {
        console.log("Detected greeting, using greeting handler");
        return GreetingHandler.getGreetingResponse();
      }
      
      // Check for specific topic handlers first
      // These provide better, more natural responses to common queries
      const financialResponse = ConversationalHandler.handleFinancialReparationQuery(query);
      if (financialResponse) {
        console.log("Using financial reparation handler for response");
        return financialResponse;
      }
      
      const landResponse = ConversationalHandler.handleLandSovereigntyQuery(query);
      if (landResponse) {
        console.log("Using land sovereignty handler for response");
        return landResponse;
      }
      
      const culturalResponse = ConversationalHandler.handleCulturalRecognitionQuery(query);
      if (culturalResponse) {
        console.log("Using cultural recognition handler for response");
        return culturalResponse;
      }
      
      const politicalResponse = ConversationalHandler.handlePoliticalRepresentationQuery(query);
      if (politicalResponse) {
        console.log("Using political representation handler for response");
        return politicalResponse;
      }
      
      // Retrieve relevant documents
      console.log(`Searching vector DB for query: "${query}"`);
      const relevantDocs = await vectorDb.similaritySearch(query, ragConfig.topK || 5);
      console.log(`Found ${relevantDocs.length} relevant documents`);
      
      if (relevantDocs.length === 0) {
        console.log("No relevant documents found, using conversational handler");
        return ConversationalHandler.createConversationalResponse(query, []);
      }
      
      // Use our conversational handler for a more natural response
      return ResponseFormatter.createConversationalResponse(query, relevantDocs);
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
          // FIXED: Better authentication error handling and detection of API key issues
          const trimmedKey = openRouterConfig.apiKey.trim();
          const keyLength = trimmedKey.length;
          const keyStart = trimmedKey.substring(0, 10);
          console.error(`Authentication error with key starting with ${keyStart}... (length: ${keyLength})`);
          
          // Check for specific format or character issues in the API key
          if (trimmedKey.includes(" ") || trimmedKey.includes("\n")) {
            return "I'm having trouble authenticating with my knowledge service. This might be due to an issue with spaces in the API key configuration. Could you try asking me something about the Khoisan mandate that doesn't require looking up specific details?";
          }
          
          if (!trimmedKey.startsWith("sk-or-v1-")) {
            return "I'm currently having an authentication issue with my knowledge service. While this gets fixed, may I ask what specifically interests you about the Khoisan mandate? I can share what I know about their key positions on land, culture, representation, and reparations.";
          }
          
          return `I'm having trouble accessing my full knowledge base right now. In the meantime, I can tell you that the Khoisan mandate focuses on land sovereignty, cultural recognition, political representation, and financial reparation. Which of these areas would you like to explore?`;
        } else if (statusCode === 429) {
          return "I'm getting a lot of requests right now. Let's take a moment before continuing our conversation about the Khoisan mandate. Which aspect interests you most - land rights, cultural recognition, political representation, or financial reparations?";
        } else if (error.code === 'ECONNABORTED') {
          return "It's taking longer than expected to find that information. While we wait, I can tell you that the Khoisan mandate covers four main areas: land sovereignty, cultural recognition, political representation, and financial reparation. Which would you like to learn more about?";
        } else if (error.code === 'ERR_NETWORK') {
          return "I seem to be having connection issues at the moment. While that's being resolved, I'd be happy to chat about the Khoisan mandate based on what I already know. Would you like to hear about land sovereignty, cultural recognition, political representation, or financial reparation?";
        } else {
          console.error(`OpenRouter API error: ${errorMessage}`);
          return `I'm having trouble accessing specific information right now. Let me share what I know about the Khoisan mandate: it focuses on restoring ancestral lands, preserving cultural heritage, ensuring political representation, and obtaining financial reparations. Which of these interests you most?`;
        }
      }
      
      try {
        console.log("Trying to generate fallback response...");
        const fallbackDocs = await vectorDb.similaritySearch(query, ragConfig.topK || 5);
        return ConversationalHandler.createConversationalResponse(query, fallbackDocs);
      } catch (fallbackError) {
        console.error("Error generating fallback response:", fallbackError);
        return ConversationalHandler.createConversationalResponse(query, []);
      }
    }
  }
}

export const ragService = new RagService();
