
import axios from "axios";
import { vectorDb } from "./vectorDb";
import { toast } from "sonner";
import { openRouterConfig, ragConfig } from "./apiConfig";

interface GenerationOptions {
  max_new_tokens?: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
}

export class RagService {
  private isModelLoading: boolean = false;
  
  constructor() {
    // No need to load a model as we'll use OpenRouter API
  }
  
  public isLoading(): boolean {
    return this.isModelLoading;
  }
  
  public async generateResponse(query: string, options: GenerationOptions = {}): Promise<string> {
    try {
      if (!openRouterConfig.apiKey) {
        console.log("No API key configured for OpenRouter");
        return "API key not configured. Please set up OpenRouter API credentials in the settings.";
      }
      
      // Retrieve relevant documents
      const relevantDocs = await vectorDb.similaritySearch(query, ragConfig.topK || 5);
      
      if (relevantDocs.length === 0) {
        console.log("No relevant documents found");
        return "I couldn't find specific information, but the Khoisan Voice is dedicated to cultural preservation—learn more at https://khoisanvoice.carrd.co/. Thanks for asking!";
      }
      
      // Construct context from retrieved documents
      const context = relevantDocs
        .map(doc => `${doc.text} (Source: ${doc.source})`)
        .join("\n\n");
      
      // Construct RAG prompt
      const ragPrompt = `
You are an assistant for the Khoisan Voice initiative. Your responses should be respectful, empathetic, and professional, reflecting values of unity, heritage, and empowerment.

Context information from Khoisan Voice sources:
${context}

Based on the above context, please answer the following question about the Khoisan Voice initiative. 
If the information isn't provided in the context, say you don't have that specific information but suggest what might be relevant from what you do know.
End your response with a motivational statement that encourages engagement with the cause.

User question: ${query}

Answer (3-5 sentences max):`;

      console.log("Sending request to OpenRouter API...");
      console.log(`Using model: ${openRouterConfig.model}`);
      
      // Call OpenRouter API
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
            "HTTP-Referer": window.location.href, // Required by OpenRouter
            "X-Title": "Khoisan Voice Assistant" // Optional but helpful for tracking
          }
        }
      );
      
      // Extract the assistant's message
      if (response.data.choices && response.data.choices.length > 0) {
        const generatedText = response.data.choices[0].message.content.trim();
        
        // Add citations if they don't exist
        const responseWithCitations = this.ensureCitations(generatedText, relevantDocs);
        
        return responseWithCitations;
      } else {
        console.log("No response generated from OpenRouter");
        return "I couldn't generate a response at this time. Please try again later or visit https://khoisanvoice.carrd.co/ for more information about the Khoisan Voice initiative.";
      }
    } catch (error) {
      console.error("Error generating response:", error);
      
      // More detailed error handling
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.error?.message || error.message;
        
        console.error(`API error: ${statusCode} - ${errorMessage}`);
        
        if (statusCode === 401 || statusCode === 403) {
          return "Authentication error with OpenRouter API. Please check your API key in the settings.";
        } else if (statusCode === 429) {
          return "Rate limit exceeded. Please try again later or consider upgrading your OpenRouter plan.";
        } else {
          console.error(`OpenRouter API error: ${errorMessage}`);
          return `Error connecting to the AI service. Please try again later. (Error: ${statusCode || 'Unknown'})`;
        }
      }
      
      // Fallback when OpenRouter is not available - use predefined responses based on keywords
      console.log("Using fallback response mechanism for query:", query);
      return this.getFallbackResponse(query, relevantDocs);
    }
  }
  
  // Provide a fallback response based on keywords in the user's query
  private getFallbackResponse(query: string, docs: any[]): string {
    const queryLower = query.toLowerCase();
    
    // Provide responses for common mandate-related topics
    if (queryLower.includes("land") || queryLower.includes("sovereignty")) {
      return "Supporting the Khoisan mandate on land sovereignty is crucial as it seeks to restore ancestral territories that were unjustly taken during colonization. This includes complete land ownership, mineral rights, and maritime resource access. Land sovereignty is fundamental to the Khoisan people's cultural survival and economic independence. Join us in advocating for this historical justice! (Source: Khoisan Mandate)";
    }
    
    if (queryLower.includes("culture") || queryLower.includes("language") || queryLower.includes("recognition")) {
      return "Supporting the Khoisan cultural recognition mandate is essential because it aims to preserve endangered languages with fewer than 100 speakers remaining and eliminate colonial classifications that erase indigenous identity. Cultural recognition ensures the preservation of ancient knowledge and traditions for future generations. Together, we can help revitalize this irreplaceable heritage! (Source: https://khoisanvoice.carrd.co/)";
    }
    
    if (queryLower.includes("representation") || queryLower.includes("parliament") || queryLower.includes("political")) {
      return "The Khoisan political representation mandate deserves support because it calls for direct proportional parliamentary representation and veto power on legislation affecting Khoisan territories. Despite constitutional recognition in some countries, practical implementation of Khoisan rights remains severely limited. Your advocacy helps ensure indigenous voices are heard in decisions that affect their future! (Source: Khoisan Mandate)";
    }
    
    if (queryLower.includes("financial") || queryLower.includes("reparation") || queryLower.includes("compensation")) {
      return "Supporting the financial reparation mandate is important as it establishes mechanisms to address centuries of economic injustice against the Khoisan people. This includes a dedicated national fund for community development and transparent compensation for historical damages. Economic justice is a crucial step toward healing and rebuilding. Stand with us in this vital cause! (Source: Khoisan Mandate)";
    }
    
    if (queryLower.includes("support") || queryLower.includes("important") || queryLower.includes("why")) {
      return "Supporting the Khoisan mandate is crucial because it addresses historical injustices against indigenous people who have lived in Southern Africa for 140,000 years but faced land dispossession, cultural erasure, and systematic marginalization. The mandate seeks to restore land sovereignty, cultural recognition, political representation, and economic justice through reparations. By supporting this cause, you contribute to healing historical wounds and creating a more just society. Join us in this important movement for indigenous rights! (Source: Khoisan Mandate)";
    }
    
    // Default fallback response if no keywords match
    return "The Khoisan mandate represents a comprehensive approach to addressing historical injustices faced by the indigenous people of Southern Africa. It covers land sovereignty, cultural recognition, political representation, and financial reparation. Supporting this mandate helps promote justice, dignity, and self-determination for a people whose rights have been systematically violated for centuries. Learn more at https://khoisanvoice.carrd.co/ and join our movement for indigenous rights!";
  }
  
  // Ensure the response has citations
  private ensureCitations(text: string, docs: any[]): string {
    // If text already has citations, return as is
    if (text.includes("Source:") || text.includes("(Source:")) {
      return text;
    }
    
    // Add citation to the main source
    if (docs.length > 0) {
      const mainSource = docs[0].source;
      return `${text}\n\n(Source: ${mainSource})`;
    }
    
    return text;
  }
}

// Create singleton instance
export const ragService = new RagService();
