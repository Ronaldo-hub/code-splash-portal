import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, ArrowLeft, Cog, MessageSquare, AlertCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import { Message, initialMessages, loadAIModel } from "@/utils/aiUtils";
import { updateContentDatabase, scheduleContentUpdates } from "@/utils/contentFetcher";
import ApiSettings from "@/components/ApiSettings";
import KnowledgeBaseDemo from "@/components/KnowledgeBaseDemo";
import { toast } from "sonner";
import { ragService } from "@/utils/ragService";
import { loadConfigurationsFromStorage } from "@/utils/apiConfig";

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [model, setModel] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [modelLoadError, setModelLoadError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadConfigurationsFromStorage();
    
    let isMounted = true;
    
    const initializeAI = async () => {
      try {
        const textGenerator = await loadAIModel();
        if (isMounted) {
          setModel(textGenerator);
          setIsModelLoading(false);
          setModelLoadError(null);
          console.log("AI model initialized successfully");
        }
      } catch (error) {
        console.error("Error initializing AI model:", error);
        if (isMounted) {
          setIsModelLoading(false);
          setModelLoadError("Failed to initialize AI model");
          toast.error("Failed to initialize AI model. Will use OpenRouter API as fallback.");
        }
      }
    };

    initializeAI();
    
    const initializeContent = async () => {
      try {
        await updateContentDatabase();
        console.log("Content database initialized successfully");
      } catch (error) {
        console.error("Error initializing content database:", error);
        toast.error("Failed to initialize content database. Some responses may be limited.");
      }
    };
    
    initializeContent();
    
    scheduleContentUpdates();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefreshContent = async () => {
    toast.info("Refreshing knowledge base...");
    try {
      await updateContentDatabase();
      toast.success("Knowledge base refreshed successfully");
    } catch (error) {
      console.error("Error refreshing content database:", error);
      toast.error("Failed to refresh knowledge base");
    }
  };

  const handleSendMessage = async (inputText: string) => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = { role: "user", content: inputText };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsTyping(true);
    
    try {
      console.log("Processing user message:", inputText);
      
      console.log("Using RAG service for:", inputText);
      
      try {
        const response = await ragService.generateResponse(inputText);
        console.log("RAG response received:", response);
        
        setTimeout(() => {
          setMessages(prevMessages => [
            ...prevMessages, 
            { role: "assistant", content: response }
          ]);
          setIsTyping(false);
        }, 1000);
      } catch (error) {
        console.error("Error in RAG service response generation:", error);
        handleResponseError();
      }
    } catch (error) {
      console.error("Error in message handling:", error);
      handleResponseError();
    }
  };

  const handleResponseError = () => {
    setMessages(prevMessages => [
      ...prevMessages,
      { 
        role: "assistant", 
        content: "I'm having trouble processing your request right now. This could be due to a connection issue or server load. Please try again in a few moments, or check the API settings to ensure everything is configured correctly." 
      }
    ]);
    setIsTyping(false);
    toast.error("Error generating response. Please try again later.");
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
        
        <div className="max-w-4xl mx-auto">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                Khoisan Mandate Assistant
              </CardTitle>
              <CardDescription>
                Ask questions about the Khoisan First Nations mandate on land sovereignty, cultural recognition, representation, and financial reparation.
              </CardDescription>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="grid grid-cols-2 w-[400px]">
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Cog className="h-4 w-4" />
                    API Settings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat" className="mt-0">
                  <div className="flex flex-col space-y-4">
                    {modelLoadError && (
                      <div className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-800 rounded-md mb-2">
                        <AlertCircle className="h-5 w-5" />
                        <p className="text-sm">
                          {modelLoadError}. Using OpenRouter API as fallback.
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-end mb-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRefreshContent}
                        className="flex items-center gap-1"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Refresh Knowledge Base
                      </Button>
                    </div>
                    
                    <MessageList messages={messages} isTyping={isTyping} />
                    <ChatInput 
                      onSendMessage={handleSendMessage}
                      onReset={resetConversation}
                      isModelLoading={isModelLoading}
                    />
                    
                    {isModelLoading && (
                      <div className="text-sm text-muted-foreground">
                        Loading AI assistant... This may take a moment.
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-0">
                  <ApiSettings />
                </TabsContent>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              <KnowledgeBaseDemo />
            </CardContent>
          </Card>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="text-lg font-medium mb-2">About this Assistant</h3>
            <p className="text-sm text-muted-foreground">
              This AI assistant uses Retrieval-Augmented Generation (RAG) to provide information about the Khoisan First Nations mandate. It retrieves relevant content from the Khoisan Voice Twitter page and website to answer your questions accurately.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-sm">
                <h4 className="font-medium">Sources:</h4>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Khoisan Voice Twitter (@KhoisanVoice)</li>
                  <li>Official Khoisan Voice website</li>
                  <li>Khoisan Mandate documentation</li>
                </ul>
              </div>
              <div className="text-sm">
                <h4 className="font-medium">Suggested Questions:</h4>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>What land rights do the Khoisan people demand?</li>
                  <li>Why is cultural recognition important to the Khoisan?</li>
                  <li>How does the mandate address political representation?</li>
                  <li>What forms of financial reparation are being sought?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIAssistant;
