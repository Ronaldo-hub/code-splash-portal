import { pipeline } from "@huggingface/transformers";
import { toast } from "sonner";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "Hello! I'm here to explain why supporting the mandate for renewable energy infrastructure in rural communities is crucial. Would you like to know more about how this initiative can benefit these communities and contribute to sustainable development?"
  }
];

// Predefined responses focused on the mandate
export const predefinedResponses: Record<string, string> = {
  "what is the mandate": "The mandate focuses on supporting renewable energy infrastructure in rural communities. This initiative aims to bring sustainable power solutions to areas that have limited access to reliable electricity, improving quality of life and enabling economic development.",
  "why support": "Supporting this mandate is crucial because it helps rural communities access clean, reliable energy. This leads to improved healthcare facilities, better educational opportunities, and increased economic activities. It also reduces reliance on fossil fuels and helps combat climate change.",
  "how does it work": "You can support this mandate by sending tokens to our quantum-resistant wallet address. The number of tokens received indicates the level of support for implementing renewable energy infrastructure in rural communities. Every token counts towards making sustainable energy accessible.",
  "benefits": "The benefits of supporting renewable energy in rural areas include: 1) Reliable electricity for homes and businesses 2) Reduced energy costs for communities 3) New job opportunities in the renewable energy sector 4) Improved healthcare and education facilities 5) Environmental protection through clean energy adoption.",
  "impact": "Your support has direct impact. The tokens received help demonstrate community backing for renewable energy projects, which is crucial for securing additional funding and resources. This helps accelerate the implementation of solar, wind, and other renewable energy solutions in rural areas.",
  "why quantum resistant": "Our wallet uses quantum-resistant cryptography to ensure that your support remains secure even against future quantum computing threats. This means your contribution to rural renewable energy infrastructure is protected by the most advanced security technology available.",
};

export const findBestMatch = (input: string): string | null => {
  const normalizedInput = input.toLowerCase();
  
  // Check for exact matches first
  for (const [key, response] of Object.entries(predefinedResponses)) {
    if (normalizedInput.includes(key)) {
      return response;
    }
  }
  
  // Check for partial matches
  for (const [key, response] of Object.entries(predefinedResponses)) {
    const keywords = key.split(" ");
    if (keywords.some(word => normalizedInput.includes(word) && word.length > 3)) {
      return response;
    }
  }
  
  return null;
};

export const loadAIModel = async (): Promise<any> => {
  try {
    toast.info("Loading AI assistant model...");
    // Use a small model for text generation
    const textGenerator = await pipeline(
      "text-generation",
      "Xenova/distilgpt2"
    );
    toast.success("AI assistant ready!");
    return textGenerator;
  } catch (error) {
    console.error("Error loading model:", error);
    toast.error("Failed to load AI assistant model. Please try again later.");
    throw error;
  }
};
