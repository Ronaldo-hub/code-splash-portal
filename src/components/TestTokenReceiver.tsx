
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Coins } from "lucide-react";

const TestTokenReceiver = () => {
  const testTokenReception = async () => {
    try {
      // This simulates receiving a test token - in production this would be a real Algorand transaction
      const response = await fetch('http://localhost:5000/api/fund-voter/ALGO7QNTVXZWDCBUDMJG5QO6L6ZFEKMPWOKBKJT5ZQOM6NMHOWL3RYPJXA', {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success("Successfully received test token!");
      } else {
        toast.error("Failed to receive test token: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error testing token reception:", error);
      toast.error("Failed to test token reception. Is the backend running?");
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
        >
          <Coins className="h-4 w-4" />
          Test Receive Token
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          This will simulate receiving an Algorand token to test the wallet's functionality.
          Make sure the backend server is running at localhost:5000.
        </p>
      </CardContent>
    </Card>
  );
};

export default TestTokenReceiver;
