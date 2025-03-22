
import React, { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { pipeline } from "@huggingface/transformers";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "Hello! I'm your Quantum Voting assistant. I can help you understand how our blockchain-based voting system works, explain quantum security, or assist with any questions about registration, voting, or our platform. How can I help you today?"
  }
];

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [model, setModel] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load the model when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const loadModel = async () => {
      try {
        toast.info("Loading AI assistant model...");
        // Use a small model for text generation with properly typed options
        const textGenerator = await pipeline(
          "text-generation",
          "Xenova/distilgpt2",
          { 
            quantized: false,
            progress_callback: undefined 
          }
        );
        
        if (isMounted) {
          setModel(textGenerator);
          setIsModelLoading(false);
          toast.success("AI assistant ready!");
        }
      } catch (error) {
        console.error("Error loading model:", error);
        if (isMounted) {
          toast.error("Failed to load AI assistant model. Please try again later.");
          setIsModelLoading(false);
        }
      }
    };

    loadModel();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Predefined responses for common voting-related questions
  const predefinedResponses: Record<string, string> = {
    "how does voting work": "Our blockchain-based voting system works by securely recording your vote on the Algorand blockchain. This ensures your vote cannot be tampered with and provides a transparent audit trail. Votes are encrypted with quantum-resistant cryptography for maximum security.",
    "what is quantum security": "Quantum security uses advanced cryptographic methods resistant to attacks from quantum computers. Our system uses post-quantum cryptography to protect your votes from both current and future technological threats, ensuring long-term data security.",
    "how do i register": "To register as a voter, go to the Register page where you'll provide your ID number for verification. Our system will create a secure blockchain wallet and quantum-resistant keys for you automatically. This only takes a few moments!",
    "how to create election": "To create an election, navigate to the Create Election page, fill in the details including title, description, and options. You'll need a funded wallet to cover the blockchain transaction fees. Once submitted, the election will be published on the blockchain.",
    "how to vote": "To cast a vote, go to the Cast Vote page, select the active election you want to participate in, choose your preferred option, and confirm. Your vote will be securely recorded on the blockchain using quantum-resistant encryption.",
    "what is offline voting": "Offline voting allows you to prepare your vote without an internet connection. You can create a vote, save it, and submit it later when you're online. This is particularly useful for remote Khoisan communities with limited connectivity.",
    "wallet funding": "You need to fund your wallet to pay for blockchain transaction fees. On the Fund Wallet page, you can add ALGO to your wallet. These small fees are necessary to process your votes and create elections on the Algorand blockchain.",
  };

  const findBestMatch = (input: string): string | null => {
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

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput("");
    setIsTyping(true);
    
    try {
      let response: string;
      
      // Check for predefined responses
      const predefinedResponse = findBestMatch(input);
      
      if (predefinedResponse) {
        // Use predefined response
        response = predefinedResponse;
      } else if (model) {
        // Use the model for other questions
        const result = await model(userMessage.content, {
          max_new_tokens: 100,
          temperature: 0.7
        });
        response = result[0].generated_text.replace(userMessage.content, "").trim();
        
        // Fallback if model returns empty or nonsensical response
        if (!response || response.length < 10) {
          response = "I'm not sure how to answer that specifically. As your voting assistant, I can help with questions about registration, voting, elections, blockchain security, and our platform features. Is there something specific about the voting process you'd like to know?";
        }
      } else {
        response = "Sorry, the AI model hasn't loaded yet. Please try again in a moment.";
      }
      
      // Add assistant response after a small delay to simulate thinking
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages, 
          { role: "assistant", content: response }
        ]);
        setIsTyping(false);
      }, 500);
      
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          role: "assistant", 
          content: "Sorry, I encountered an error processing your request. Please try again later." 
        }
      ]);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetConversation = () => {
    setMessages(initialMessages);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate("/")} 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        
        <div className="max-w-3xl mx-auto">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                AI Voting Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-4 h-[50vh] overflow-y-auto p-4 bg-muted/50 rounded-lg">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "assistant" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "assistant"
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-secondary text-secondary-foreground">
                        <div className="flex space-x-2">
                          <div className="h-2 w-2 rounded-full bg-current animate-bounce"></div>
                          <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-75"></div>
                          <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-150"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="flex items-center space-x-2">
                  <Textarea
                    placeholder="Ask about voting, registration, security..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isModelLoading}
                    className="min-h-[60px]"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!input.trim() || isModelLoading}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetConversation}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reset
                  </Button>
                </div>
                
                {isModelLoading && (
                  <div className="text-center text-sm text-muted-foreground">
                    Loading AI assistant model... This may take a moment.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 text-sm text-muted-foreground">
            <p className="text-center">
              This AI assistant uses local models for demonstration purposes. It has limited knowledge but can help with basic questions about the voting system.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIAssistant;
