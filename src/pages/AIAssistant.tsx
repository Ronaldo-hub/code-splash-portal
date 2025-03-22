
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import { Message, initialMessages, findBestMatch, loadAIModel } from "@/utils/aiUtils";

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [model, setModel] = useState<any>(null);
  const navigate = useNavigate();

  // Load the model when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const initializeAI = async () => {
      try {
        const textGenerator = await loadAIModel();
        if (isMounted) {
          setModel(textGenerator);
          setIsModelLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setIsModelLoading(false);
        }
      }
    };

    initializeAI();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSendMessage = async (inputText: string) => {
    // Add user message
    const userMessage: Message = { role: "user", content: inputText };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsTyping(true);
    
    try {
      let response: string;
      
      // Check for predefined responses
      const predefinedResponse = findBestMatch(inputText);
      
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
                <MessageList messages={messages} isTyping={isTyping} />
                <ChatInput 
                  onSendMessage={handleSendMessage}
                  onReset={resetConversation}
                  isModelLoading={isModelLoading}
                />
                
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
