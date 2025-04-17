
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
        return "API key not configured. Please set up OpenRouter API credentials in the settings.";
      }
      
      // Retrieve relevant documents
      const relevantDocs = await vectorDb.similaritySearch(query, ragConfig.topK || 5);
      
      if (relevantDocs.length === 0) {
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
        return "I couldn't generate a response at this time. Please try again later or visit https://khoisanvoice.carrd.co/ for more information about the Khoisan Voice initiative.";
      }
    } catch (error) {
      console.error("Error generating response:", error);
      
      // More detailed error handling
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.error?.message || error.message;
        
        if (statusCode === 401 || statusCode === 403) {
          return "Authentication error with OpenRouter API. Please check your API key in the settings.";
        } else if (statusCode === 429) {
          return "Rate limit exceeded. Please try again later or consider upgrading your OpenRouter plan.";
        } else {
          console.error(`OpenRouter API error: ${errorMessage}`);
          return `Error connecting to the AI service. Please try again later. (Error: ${statusCode || 'Unknown'})`;
        }
      }
      
      return "I encountered an error while processing your request. Please try again later or visit https://khoisanvoice.carrd.co/ to learn more about the Khoisan Voice initiative.";
    }
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
