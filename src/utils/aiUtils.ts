
import { pipeline } from "@huggingface/transformers";
import { toast } from "sonner";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "Hello! I'm your Quantum Voting assistant. I can help you understand how our blockchain-based voting system works, explain quantum security, or assist with any questions about registration, voting, or our platform. How can I help you today?"
  }
];

// Predefined responses for common voting-related questions
export const predefinedResponses: Record<string, string> = {
  "how does voting work": "Our blockchain-based voting system works by securely recording your vote on the Algorand blockchain. This ensures your vote cannot be tampered with and provides a transparent audit trail. Votes are encrypted with quantum-resistant cryptography for maximum security.",
  "what is quantum security": "Quantum security uses advanced cryptographic methods resistant to attacks from quantum computers. Our system uses post-quantum cryptography to protect your votes from both current and future technological threats, ensuring long-term data security.",
  "how do i register": "To register as a voter, go to the Register page where you'll provide your ID number for verification. Our system will create a secure blockchain wallet and quantum-resistant keys for you automatically. This only takes a few moments!",
  "how to create election": "To create an election, navigate to the Create Election page, fill in the details including title, description, and options. You'll need a funded wallet to cover the blockchain transaction fees. Once submitted, the election will be published on the blockchain.",
  "how to vote": "To cast a vote, go to the Cast Vote page, select the active election you want to participate in, choose your preferred option, and confirm. Your vote will be securely recorded on the blockchain using quantum-resistant encryption.",
  "what is offline voting": "Offline voting allows you to prepare your vote without an internet connection. You can create a vote, save it, and submit it later when you're online. This is particularly useful for remote Khoisan communities with limited connectivity.",
  "wallet funding": "You need to fund your wallet to pay for blockchain transaction fees. On the Fund Wallet page, you can add ALGO to your wallet. These small fees are necessary to process your votes and create elections on the Algorand blockchain.",
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
