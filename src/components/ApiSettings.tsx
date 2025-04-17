
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { 
  setOpenRouterCredentials, 
  setXApiCredentials, 
  openRouterConfig, 
  xApiConfig,
  saveConfigurationsToStorage,
  loadConfigurationsFromStorage
} from "@/utils/apiConfig";
import { updateContentDatabase } from "@/utils/contentFetcher";
import { LockIcon, KeyIcon, RefreshCwIcon, ThermometerIcon, HashIcon } from "lucide-react";

const ApiSettings = () => {
  // OpenRouter settings
  const [openRouterKey, setOpenRouterKey] = useState(openRouterConfig.apiKey);
  const [openRouterModel, setOpenRouterModel] = useState(openRouterConfig.model);
  const [temperature, setTemperature] = useState(openRouterConfig.temperature);
  const [maxTokens, setMaxTokens] = useState(openRouterConfig.maxNewTokens);
  
  // X API settings
  const [xBearerToken, setXBearerToken] = useState(xApiConfig.bearerToken);
  const [xApiKey, setXApiKey] = useState(xApiConfig.apiKey);
  const [xApiSecret, setXApiSecret] = useState(xApiConfig.apiKeySecret);
  const [xAccessToken, setXAccessToken] = useState(xApiConfig.accessToken);
  const [xAccessSecret, setXAccessSecret] = useState(xApiConfig.accessTokenSecret);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Load saved configurations on component mount
  useEffect(() => {
    loadConfigurationsFromStorage();
    // Update state with loaded configurations
    setOpenRouterKey(openRouterConfig.apiKey);
    setOpenRouterModel(openRouterConfig.model);
    setTemperature(openRouterConfig.temperature);
    setMaxTokens(openRouterConfig.maxNewTokens);
    setXBearerToken(xApiConfig.bearerToken);
    setXApiKey(xApiConfig.apiKey);
    setXApiSecret(xApiConfig.apiKeySecret);
    setXAccessToken(xApiConfig.accessToken);
    setXAccessSecret(xApiConfig.accessTokenSecret);
  }, []);
  
  const handleSaveOpenRouter = async () => {
    setIsSaving(true);
    try {
      setOpenRouterCredentials(openRouterKey, openRouterModel, temperature, maxTokens);
      saveConfigurationsToStorage();
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
      saveConfigurationsToStorage();
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
            <Label htmlFor="llm-model">Select LLM Model</Label>
            <Select 
              value={openRouterModel} 
              onValueChange={(value) => setOpenRouterModel(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {openRouterConfig.availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name} {model.free ? "(Free)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {openRouterConfig.availableModels.find(m => m.id === openRouterModel)?.description || "Select a model"}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="temperature" className="flex items-center gap-1">
                <ThermometerIcon className="h-4 w-4" />
                Temperature
              </Label>
              <span className="text-sm">{temperature.toFixed(2)}</span>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={1.0}
              step={0.01}
              value={[temperature]}
              onValueChange={(values) => setTemperature(values[0])}
            />
            <p className="text-xs text-muted-foreground">
              Lower values produce more focused and deterministic responses. Higher values increase creativity and randomness.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="max-tokens" className="flex items-center gap-1">
                <HashIcon className="h-4 w-4" />
                Max New Tokens
              </Label>
              <span className="text-sm">{maxTokens}</span>
            </div>
            <Slider
              id="max-tokens"
              min={100}
              max={1000}
              step={10}
              value={[maxTokens]}
              onValueChange={(values) => setMaxTokens(values[0])}
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of tokens to generate in the response. 1 token is approximately 4 characters.
            </p>
          </div>
          
          <Button 
            onClick={handleSaveOpenRouter} 
            disabled={isSaving} 
            className="w-full mt-2"
          >
            {isSaving ? "Saving..." : "Save LLM Settings"}
          </Button>
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
