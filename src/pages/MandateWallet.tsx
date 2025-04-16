import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Copy, QrCode, Coins } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import TestTokenReceiver from "@/components/TestTokenReceiver";

const MandateWallet = () => {
  const [votingPower, setVotingPower] = useState(0);
  const [totalVotingPower, setTotalVotingPower] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);
  
  const walletAddress = "ALGO7QNTVXZWDCBUDMJG5QO6L6ZFEKMPWOKBKJT5ZQOM6NMHOWL3RYPJXA";
  const mandate = `Official Mandate to Parliamentary Representatives:

WE, THE KHOISAN FIRST NATIONS PEOPLE, HEREBY DECLARE:

LAND AND SOVEREIGNTY:
1. Full recognition of Khoisan as the original and sovereign First Nations of Southern Africa
2. Unconditional return of ancestral territories, including:
   - Complete and unencumbered land ownership
   - Full mineral extraction rights
   - Comprehensive fishing and maritime resource rights

CULTURAL RECOGNITION:
1. Immediate cessation of the term "coloured" in all official documentation
2. Official recognition of Khoisan languages as national languages
3. Comprehensive state-funded language preservation and development programs

REPRESENTATION AND CONSENT:
1. Direct, proportional parliamentary representation
2. Absolute veto power on any legislation affecting Khoisan territories and rights
3. No agreements, treaties, or legislative actions shall be enacted without explicit, documented Khoisan community consent

FINANCIAL REPARATION:
1. Dedicated national fund for Khoisan community development
2. Transparent mechanism for historical economic damage compensation

This mandate is a non-negotiable assertion of our fundamental human rights, cultural identity, and territorial sovereignty.`;

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockVotingPower = Math.floor(Math.random() * 650);
        setVotingPower(mockVotingPower);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        toast.error("Failed to load wallet data");
        setIsLoading(false);
      }
    };
    
    fetchWalletData();
  }, []);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Wallet address copied to clipboard"))
      .catch(() => toast.error("Failed to copy wallet address"));
  };
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };
  
  const getProgressColor = (percentage: number) => {
    if (percentage < 25) return "bg-red-500";
    if (percentage < 50) return "bg-orange-500";
    if (percentage < 75) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  const votingPercentage = (votingPower / totalVotingPower) * 100;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-primary" />
          Quantum-Secure Mandate Wallet
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Mandate Information</CardTitle>
              <CardDescription>
                This wallet receives tokens as votes supporting the following mandate:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg mb-4 border border-border">
                <pre className="text-sm font-medium whitespace-pre-wrap">{mandate}</pre>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6">
                When you send tokens to this wallet, you are indicating your support for this mandate.
                The wallet uses quantum-resistant cryptography to secure votes.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Support Level</h3>
                  <Progress 
                    value={votingPower / totalVotingPower * 100} 
                    className={`h-2 ${getProgressColor(votingPower / totalVotingPower * 100)}`} 
                  />
                  <div className="flex justify-between mt-1 text-sm">
                    <span>{isLoading ? "Loading..." : `${votingPower} tokens`}</span>
                    <span>{`${Math.round(votingPower / totalVotingPower * 100)}% of goal`}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Quantum-Secure Wallet</CardTitle>
              <CardDescription>
                Send your tokens to this wallet address to support the mandate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg mb-4 flex items-center justify-between border border-border break-all">
                <p className="text-sm font-mono mr-2">{isLoading ? "Loading wallet address..." : walletAddress}</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => copyToClipboard(walletAddress)}
                  disabled={isLoading}
                  title="Copy wallet address"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  disabled={isLoading}
                >
                  <QrCode className="h-4 w-4" />
                  <span>Show QR Code</span>
                </Button>
                
                <Button 
                  variant="default" 
                  className="flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Coins className="h-4 w-4" />
                  <span>Send Tokens</span>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <p>This wallet uses post-quantum cryptography to protect against quantum computing attacks.</p>
            </CardFooter>
          </Card>
        </div>
        
        <TestTokenReceiver />
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Each voter has tokens in their wallet that represent their voting power</li>
                <li>To support a mandate, send tokens to the wallet address shown above</li>
                <li>The number of tokens the wallet receives indicates the level of support</li>
                <li>Results are recorded on a transparent, immutable blockchain</li>
                <li>All transactions are secured using quantum-resistant cryptography</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MandateWallet;
