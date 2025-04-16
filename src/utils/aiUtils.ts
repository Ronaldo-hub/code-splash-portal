
import { pipeline } from "@huggingface/transformers";
import { toast } from "sonner";
import { ragService } from "./ragService";
import { initializeContentDatabase } from "./contentFetcher";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

// Updated initial messages to align with the Khoisan mandate
export const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "Hello! I'm your AI assistant focused on the Khoisan First Nations mandate. I can explain our position on land sovereignty, cultural recognition, representation, and financial reparation. How can I help you understand our cause today?"
  }
];

// Initialize the content database when this module is loaded
initializeContentDatabase();

// Using RAG service to generate responses
export const findBestMatch = (input: string): string | null => {
  return null; // We'll use the RAG service instead
};

export const loadAIModel = async (): Promise<any> => {
  // We're just returning a function that will use our RAG service
  return async (userInput: string, options: any) => {
    try {
      const response = await ragService.generateResponse(userInput, {
        max_new_tokens: options.max_new_tokens,
        temperature: options.temperature,
      });
      
      // Format the response to match the expected output format of the text generation pipeline
      return [{
        generated_text: userInput + " " + response
      }];
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Failed to generate response");
      return [{
        generated_text: userInput + " I'm having trouble processing your request right now. Please try again later."
      }];
    }
  };
};
