
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import KnowledgeBaseDemo from "./KnowledgeBaseDemo";

const TestTokenReceiver = () => {
  const [tokens, setTokens] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokens.trim() || isNaN(Number(tokens))) {
      toast.error("Please enter a valid number of tokens");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate sending tokens to support the mandate
    setTimeout(() => {
      toast.success(`Successfully sent ${tokens} tokens to support the mandate!`);
      setTokens("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="mt-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Test Token Support</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tokens">Number of Tokens to Send</Label>
              <Input
                id="tokens"
                type="text"
                placeholder="Enter number of tokens"
                value={tokens}
                onChange={(e) => setTokens(e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                For testing purposes only. This simulates sending tokens to support the mandate.
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Processing..."
              ) : (
                <>
                  Send Tokens to Support <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowKnowledgeBase(!showKnowledgeBase)}
            >
              {showKnowledgeBase ? "Hide Knowledge Base Demo" : "Show Knowledge Base Demo"}
            </Button>
          </div>
          
          {showKnowledgeBase && <KnowledgeBaseDemo />}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestTokenReceiver;
