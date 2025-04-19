
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { LockIcon } from "lucide-react";
import { 
  setXApiCredentials, 
  xApiConfig,
  saveConfigurationsToStorage,
} from "@/utils/apiConfig";

interface XApiSettingsProps {
  onSave?: () => void;
}

const XApiSettings: React.FC<XApiSettingsProps> = ({ onSave }) => {
  const [xBearerToken, setXBearerToken] = useState(xApiConfig.bearerToken);
  const [xApiKey, setXApiKey] = useState(xApiConfig.apiKey);
  const [xApiSecret, setXApiSecret] = useState(xApiConfig.apiKeySecret);
  const [xAccessToken, setXAccessToken] = useState(xApiConfig.accessToken);
  const [xAccessSecret, setXAccessSecret] = useState(xApiConfig.accessTokenSecret);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
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
      onSave?.();
    } catch (error) {
      console.error("Error saving X API credentials:", error);
      toast.error("Failed to save X API credentials");
    } finally {
      setIsSaving(false);
    }
  };

  return (
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
          onClick={handleSave} 
          disabled={isSaving} 
          className="w-full mt-2"
        >
          {isSaving ? "Saving..." : "Save X API Credentials"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default XApiSettings;
