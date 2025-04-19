
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { KeyIcon, ThermometerIcon, HashIcon, AlertCircleIcon } from "lucide-react";
import { 
  setOpenRouterCredentials, 
  openRouterConfig,
  saveConfigurationsToStorage,
  validateOpenRouterKey
} from "@/utils/apiConfig";

interface OpenRouterSettingsProps {
  onSave?: () => void;
}

const OpenRouterSettings: React.FC<OpenRouterSettingsProps> = ({ onSave }) => {
  const [openRouterKey, setOpenRouterKey] = useState(openRouterConfig.apiKey);
  const [openRouterModel, setOpenRouterModel] = useState(openRouterConfig.model);
  const [temperature, setTemperature] = useState(openRouterConfig.temperature);
  const [maxTokens, setMaxTokens] = useState(openRouterConfig.maxNewTokens);
  const [keyValidation, setKeyValidation] = useState<{valid: boolean; message?: string}>({valid: true});
  const [isSaving, setIsSaving] = useState(false);

  const validateKey = (key: string) => {
    const validation = validateOpenRouterKey(key);
    setKeyValidation(validation);
    return validation.valid;
  };

  const handleOpenRouterKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setOpenRouterKey(newKey);
    validateKey(newKey);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!validateKey(openRouterKey)) {
        toast.error(`API key error: ${keyValidation.message}`);
        setIsSaving(false);
        return;
      }
      
      setOpenRouterCredentials(openRouterKey, openRouterModel, temperature, maxTokens);
      saveConfigurationsToStorage();
      toast.success("OpenRouter API credentials saved");
      onSave?.();
    } catch (error) {
      console.error("Error saving OpenRouter credentials:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save OpenRouter credentials");
    } finally {
      setIsSaving(false);
    }
  };

  return (
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
            <div className="flex-1">
              <Input
                id="openrouter-key"
                type="password"
                placeholder="Enter your OpenRouter API key"
                value={openRouterKey}
                onChange={handleOpenRouterKeyChange}
                className={!keyValidation.valid ? "border-red-500" : ""}
              />
              {!keyValidation.valid && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                  <AlertCircleIcon className="h-3 w-3" />
                  {keyValidation.message}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Must begin with "sk-or-v1-" - Get a free key at <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline">openrouter.ai/keys</a>
              </p>
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="shrink-0">
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
          onClick={handleSave} 
          disabled={isSaving} 
          className="w-full mt-2"
        >
          {isSaving ? "Saving..." : "Save LLM Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default OpenRouterSettings;
