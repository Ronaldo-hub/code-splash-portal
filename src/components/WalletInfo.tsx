
import React, { useState } from "react";
import { useVotingSystem } from "@/contexts/VotingSystemContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Wallet, RefreshCw, Plus } from "lucide-react";

const WalletInfo = () => {
  const { currentVoter, addFunds, getWalletBalance, loading } = useVotingSystem();
  const [amount, setAmount] = useState<string>("0");

  const handleAddFunds = async () => {
    try {
      const parsedAmount = parseFloat(amount);
      
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
      
      await addFunds(parsedAmount);
      toast.success(`Successfully added ${parsedAmount} ALGO to your wallet`);
      setAmount("0");
    } catch (error) {
      toast.error("Failed to add funds to your wallet");
      console.error(error);
    }
  };

  if (!currentVoter) {
    return null;
  }

  const balance = getWalletBalance();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Balance
        </CardTitle>
        <CardDescription>
          Add funds to your wallet to pay for transaction fees
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground">Current Balance:</span>
          <span className="text-xl font-bold">{balance.toFixed(2)} ALGO</span>
        </div>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in ALGO"
            min="0"
            step="0.01"
          />
          <Button 
            onClick={handleAddFunds} 
            disabled={loading}
            size="sm"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        For real deployments, this would connect to a payment processor
      </CardFooter>
    </Card>
  );
};

export default WalletInfo;
