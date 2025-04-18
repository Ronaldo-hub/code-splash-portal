import { toast } from "sonner";
import { ragService } from "./ragService";
import { initializeContentDatabase } from "./contentFetcher";
import { loadConfigurationsFromStorage } from "./apiConfig";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

// Updated initial messages to align with the Khoisan mandate
export const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "Greetings! I'm your dedicated AI assistant for understanding and supporting the Khoisan First Nations mandate. I can explain our position on:\n\n• Land sovereignty\n• Cultural recognition\n• Political representation\n• Financial reparation\n\nWhat would you like to learn about first?"
  }
];

// Initialize the content database and load configurations when this module is loaded
initializeContentDatabase();
loadConfigurationsFromStorage();

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
