
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Coins, ExternalLink } from "lucide-react";

const TestTokenReceiver = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const testTokenReception = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/fund-voter/ALGO7QNTVXZWDCBUDMJG5QO6L6ZFEKMPWOKBKJT5ZQOM6NMHOWL3RYPJXA', {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(
          <div>
            Successfully received test token!
            <a 
              href={`https://testnet.algoexplorer.io/tx/${result.txid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline mt-2"
            >
              View on AlgoExplorer
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        );
      } else {
        toast.error("Failed to receive test token: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error testing token reception:", error);
      toast.error("Failed to test token reception. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-lg">Test Token Reception</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={testTokenReception}
          className="w-full flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          <Coins className="h-4 w-4" />
          {isLoading ? "Sending Test Tokens..." : "Test Receive Token"}
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          This will send 1 TestNet ALGO to test the wallet's functionality.
          Make sure the backend server is running at localhost:5000.
        </p>
      </CardContent>
    </Card>
  );
};

export default TestTokenReceiver;
