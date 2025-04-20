
import axios from "axios";
import { vectorDb } from "./vectorDb";
import { toast } from "sonner";
import { openRouterConfig, ragConfig, huggingFaceConfig } from "./apiConfig";
import { GenerationOptions, DocumentWithSource } from "./types/ragTypes";
import { GreetingHandler } from "./handlers/greetingHandler";
import { ResponseFormatter } from "./handlers/responseFormatter";
import { FallbackHandler } from "./handlers/fallbackHandler";
import { ConversationalHandler } from "./handlers/conversationalHandler";

export class RagService {
  private isModelLoading: boolean = false;
  private lastQueryTime: number = 0;
  private queryCache: Map<string, string> = new Map();
  
  public isLoading(): boolean {
    return this.isModelLoading;
  }
  
  public async generateResponse(query: string, options: GenerationOptions = {}): Promise<string> {
    try {
      // Check cache first for identical queries to improve responsiveness
      const normalizedQuery = query.trim().toLowerCase();
      if (this.queryCache.has(normalizedQuery)) {
        console.log("Using cached response for query:", normalizedQuery);
        return this.queryCache.get(normalizedQuery)!;
      }

      // Rate limiting - prevent too many requests in quick succession
      const now = Date.now();
      if (now - this.lastQueryTime < 500) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      this.lastQueryTime = now;
      
      // Validate API key
      if (!openRouterConfig.apiKey || openRouterConfig.apiKey.trim() === "") {
        console.error("No API key configured for OpenRouter");
        return "I need to be configured with a valid API key to help you better. Please check the settings.";
      }
      
      // Log API key (first 10 chars) for debugging
      const trimmedApiKey = openRouterConfig.apiKey.trim();
      console.log(`Using API key: ${trimmedApiKey.substring(0, 10)}...`);
      
      // Check if the query is a greeting
      if (GreetingHandler.isGreeting(query.toLowerCase().trim())) {
        console.log("Detected greeting, using greeting handler");
        return GreetingHandler.getGreetingResponse();
      }
      
      // Retrieve relevant documents from vector database
      console.log(`Searching vector DB for query: "${query}"`);
      const relevantDocs = await vectorDb.similaritySearch(query, ragConfig.topK || 5);
      console.log(`Found ${relevantDocs.length} relevant documents`);
      
      // Check document relevance scores (added for debugging)
      if (relevantDocs.length > 0) {
        console.log("Top document content:", relevantDocs[0].text);
        console.log("Document source:", relevantDocs[0].source);
      }
      
      // Direct topic handlers for more reliable responses to common queries
      const directTopicResponse = this.checkDirectTopicHandlers(query);
      if (directTopicResponse) {
        console.log("Using direct topic handler response");
        this.queryCache.set(normalizedQuery, directTopicResponse);
        return directTopicResponse;
      }
      
      // Fallback to appropriate handlers based on document availability
      let response;
      if (relevantDocs.length === 0) {
        console.log("No relevant documents found, using fallback handler");
        response = FallbackHandler.getFallbackResponse(query, []);
      } else {
        console.log("Creating conversational response with retrieved documents");
        response = ResponseFormatter.createConversationalResponse(query, relevantDocs);
      }
      
      // Cache the response
      this.queryCache.set(normalizedQuery, response);
      return response;
    } catch (error) {
      console.error("Error generating response:", error);
      
      if (axios.isAxiosError(error)) {
        // Enhanced error logging for Axios errors
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.error?.message || error.message;
        console.error(`API error: Status ${statusCode}, Message: ${errorMessage}`);
        
        if (statusCode === 401 || statusCode === 403) {
          return `I'm having trouble accessing my knowledge base right now. In the meantime, I can tell you that the Khoisan mandate focuses on land sovereignty, cultural recognition, political representation, and financial reparation. Which of these areas would you like to explore?`;
        } else if (statusCode === 429) {
          return "I'm getting a lot of requests right now. Let's take a moment before continuing our conversation about the Khoisan mandate. Which aspect interests you most - land rights, cultural recognition, political representation, or financial reparations?";
        } else {
          return `I'm having trouble accessing specific information right now. Let me share what I know about the Khoisan mandate: it focuses on restoring ancestral lands, preserving cultural heritage, ensuring political representation, and obtaining financial reparations. Which of these interests you most?`;
        }
      }
      
      try {
        console.log("Using mandate information as fallback");
        return this.getMandateFallbackResponse(query);
      } catch (fallbackError) {
        console.error("Error generating fallback response:", fallbackError);
        return "The Khoisan mandate represents a comprehensive approach to indigenous rights in Southern Africa. It covers land sovereignty, cultural recognition, political representation, and financial reparation. Which aspect would you like to learn more about?";
      }
    }
  }
  
  // Check for specific topic handlers based on query content
  private checkDirectTopicHandlers(query: string): string | null {
    const queryLower = query.toLowerCase();
    
    // Check for mandate-related questions
    if (queryLower.includes("mandate") && 
        (queryLower.includes("what") || queryLower.includes("about") || 
         queryLower.includes("tell") || queryLower.includes("vote"))) {
      return "The Khoisan First Nations mandate is a comprehensive framework for addressing historical injustices. It has four key pillars: (1) Land Sovereignty - returning ancestral territories with full ownership rights, (2) Cultural Recognition - preserving languages and ending colonial classifications, (3) Political Representation - ensuring direct parliamentary representation, and (4) Financial Reparation - establishing mechanisms for economic justice. Would you like to know more about any specific pillar?";
    }
    
    // Check for specific topic handlers
    const financialResponse = ConversationalHandler.handleFinancialReparationQuery(query);
    if (financialResponse) return financialResponse;
    
    const landResponse = ConversationalHandler.handleLandSovereigntyQuery(query);
    if (landResponse) return landResponse;
    
    const culturalResponse = ConversationalHandler.handleCulturalRecognitionQuery(query);
    if (culturalResponse) return culturalResponse;
    
    const politicalResponse = ConversationalHandler.handlePoliticalRepresentationQuery(query);
    if (politicalResponse) return politicalResponse;
    
    return null;
  }
  
  // Create a fallback response with mandate information
  private getMandateFallbackResponse(query: string): string {
    const topics = [
      "The Khoisan mandate calls for land sovereignty, ensuring the return of ancestral territories with full ownership rights.",
      "Cultural recognition is a key pillar, involving language preservation and eliminating colonial classifications.",
      "Political representation demands include direct parliamentary representation and veto power on legislation affecting Khoisan communities.",
      "Financial reparation mechanisms aim to address centuries of economic injustice through dedicated funds and transparent compensation processes."
    ];
    
    // Select a relevant topic based on the query
    const queryLower = query.toLowerCase();
    if (queryLower.includes("land")) return topics[0];
    if (queryLower.includes("culture") || queryLower.includes("language")) return topics[1];
    if (queryLower.includes("politic") || queryLower.includes("represent")) return topics[2];
    if (queryLower.includes("financial") || queryLower.includes("money") || queryLower.includes("fund")) return topics[3];
    
    // If no specific topic matches, return a general overview
    return "The Khoisan mandate has four key pillars: land sovereignty (returning ancestral territories), cultural recognition (preserving indigenous identity), political representation (ensuring direct parliamentary representation), and financial reparation (establishing economic justice mechanisms). Which aspect would you like to learn more about?";
  }
}

export const ragService = new RagService();
