
import React, { useState } from "react";
import { useBetaAccess } from "@/contexts/BetaAccessContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const BetaGate: React.FC = () => {
  const { hasBetaAccess, grantBetaAccess } = useBetaAccess();
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const success = grantBetaAccess(password);
    
    if (!success) {
      toast.error("Incorrect beta access password");
      setIsSubmitting(false);
    }
  };

  if (hasBetaAccess) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-6 bg-card rounded-lg shadow-lg border">
        <div className="flex flex-col items-center text-center space-y-2">
          <ShieldCheck className="h-12 w-12 text-primary" />
          <h1 className="text-2xl font-bold">Quantum Voting</h1>
          <p className="text-muted-foreground">
            This application is currently in beta testing.
            Please enter the beta access password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              placeholder="Beta Access Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Access Beta"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BetaGate;
