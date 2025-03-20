
import React from "react";
import Layout from "@/components/Layout";
import WalletInfo from "@/components/WalletInfo";
import { useVotingSystem } from "@/contexts/VotingSystemContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const WalletFunding = () => {
  const { currentVoter } = useVotingSystem();
  const navigate = useNavigate();

  if (!currentVoter) {
    // Redirect to register if no voter is logged in
    navigate("/register");
    return null;
  }

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
        
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Wallet Funding</h1>
          
          <div className="mb-8">
            <p className="text-muted-foreground mb-4 text-center">
              Add funds to your wallet to pay for gas fees when casting votes or creating elections.
            </p>
          </div>
          
          <WalletInfo />
          
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">About Gas Fees</h3>
            <p className="text-sm text-muted-foreground">
              Gas fees are required to process transactions on the Algorand blockchain. 
              Each vote or election creation requires a small amount of ALGO to cover 
              the cost of processing the transaction.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WalletFunding;
