
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { setOpenRouterCredentials, setXApiCredentials, openRouterConfig, xApiConfig } from "@/utils/apiConfig";
import { updateContentDatabase } from "@/utils/contentFetcher";
import { LockIcon, KeyIcon, RefreshCwIcon } from "lucide-react";

const ApiSettings = () => {
  // OpenRouter settings
  const [openRouterKey, setOpenRouterKey] = useState(openRouterConfig.apiKey);
  const [openRouterModel, setOpenRouterModel] = useState(openRouterConfig.model);
  
  // X API settings
  const [xBearerToken, setXBearerToken] = useState(xApiConfig.bearerToken);
  const [xApiKey, setXApiKey] = useState(xApiConfig.apiKey);
  const [xApiSecret, setXApiSecret] = useState(xApiConfig.apiKeySecret);
  const [xAccessToken, setXAccessToken] = useState(xApiConfig.accessToken);
  const [xAccessSecret, setXAccessSecret] = useState(xApiConfig.accessTokenSecret);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleSaveOpenRouter = async () => {
    setIsSaving(true);
    try {
      setOpenRouterCredentials(openRouterKey, openRouterModel);
      toast.success("OpenRouter API credentials saved");
    } catch (error) {
      console.error("Error saving OpenRouter credentials:", error);
      toast.error("Failed to save OpenRouter credentials");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveXApi = async () => {
    setIsSaving(true);
    try {
      setXApiCredentials(
        xApiKey,
        xApiSecret,
        xAccessToken,
        xAccessSecret,
        xBearerToken
      );
      toast.success("X API credentials saved");
    } catch (error) {
      console.error("Error saving X API credentials:", error);
      toast.error("Failed to save X API credentials");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleUpdateDatabase = async () => {
    setIsUpdating(true);
    try {
      const success = await updateContentDatabase();
      if (success) {
        toast.success("Content database updated successfully");
      } else {
        toast.error("Failed to update content database");
      }
    } catch (error) {
      console.error("Error updating database:", error);
      toast.error("Failed to update content database");
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyIcon className="h-5 w-5" />
            OpenRouter API Settings
          </CardTitle>
          <CardDescription>
            Configure your OpenRouter API credentials to enable the AI assistant.
            Get your free API key at <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="underline">openrouter.ai</a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openrouter-key">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="openrouter-key"
                type="password"
                placeholder="Enter your OpenRouter API key"
                value={openRouterKey}
                onChange={(e) => setOpenRouterKey(e.target.value)}
              />
              <Button onClick={handleSaveOpenRouter} disabled={isSaving} className="shrink-0">
                {isSaving ? "Saving..." : "Save Key"}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="openrouter-model">Model Name</Label>
            <Input
              id="openrouter-model"
              placeholder="e.g., meta-llama/llama-3.1-8b-instruct"
              value={openRouterModel}
              onChange={(e) => setOpenRouterModel(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Recommended model: meta-llama/llama-3.1-8b-instruct (free tier)
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LockIcon className="h-5 w-5" />
            X Developer API Settings
          </CardTitle>
          <CardDescription>
            Configure your X Developer API credentials to fetch real content.
            Get your API credentials at <a href="https://developer.x.com" target="_blank" rel="noopener noreferrer" className="underline">developer.x.com</a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="x-bearer-token">Bearer Token (Required)</Label>
            <Input
              id="x-bearer-token"
              type="password"
              placeholder="Enter your X Bearer Token"
              value={xBearerToken}
              onChange={(e) => setXBearerToken(e.target.value)}
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="x-api-key">API Key</Label>
              <Input
                id="x-api-key"
                type="password"
                placeholder="API Key"
                value={xApiKey}
                onChange={(e) => setXApiKey(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="x-api-secret">API Key Secret</Label>
              <Input
                id="x-api-secret"
                type="password"
                placeholder="API Key Secret"
                value={xApiSecret}
                onChange={(e) => setXApiSecret(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="x-access-token">Access Token</Label>
              <Input
                id="x-access-token"
                type="password"
                placeholder="Access Token"
                value={xAccessToken}
                onChange={(e) => setXAccessToken(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="x-access-secret">Access Token Secret</Label>
              <Input
                id="x-access-secret"
                type="password"
                placeholder="Access Token Secret"
                value={xAccessSecret}
                onChange={(e) => setXAccessSecret(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleSaveXApi} 
            disabled={isSaving} 
            className="w-full mt-2"
          >
            {isSaving ? "Saving..." : "Save X API Credentials"}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCwIcon className="h-5 w-5" />
            Content Database
          </CardTitle>
          <CardDescription>
            Manage the content database used for retrieving information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleUpdateDatabase} 
            disabled={isUpdating}
            className="w-full"
          >
            {isUpdating ? (
              <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCwIcon className="h-4 w-4 mr-2" />
            )}
            {isUpdating ? "Updating Database..." : "Update Content Database"}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            This will fetch the latest content from the X profile and website to update the knowledge base.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiSettings;
