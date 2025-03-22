
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Wallet, Bot } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-4xl w-full text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">Quantum-Secure Voting System</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A blockchain-based voting platform with quantum-resistant security for Khoisan communities.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Register to Vote</CardTitle>
            <CardDescription>Verify your identity and register as a voter</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Secure identity verification using Home Affairs integration and quantum-resistant encryption.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/register">Register Now</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cast Your Vote</CardTitle>
            <CardDescription>Participate in active elections</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Vote securely using blockchain technology with tamper-proof records.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/cast-vote">Vote Now</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>View Results</CardTitle>
            <CardDescription>See the outcome of completed elections</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Transparent and verifiable results secured by Algorand blockchain.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/results">View Results</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Fund Wallet
            </CardTitle>
            <CardDescription>Add funds for transaction fees</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Add ALGO to your wallet to pay for gas fees when voting or creating elections.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/wallet">Fund Now</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Assistant
            </CardTitle>
            <CardDescription>Get help with questions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Chat with our AI assistant to learn about blockchain voting and get answers to common questions.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/ai-assistant">Chat Now</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>Powered by Algorand blockchain and quantum-resistant cryptography</p>
      </div>
    </div>
  );
};

export default Index;
