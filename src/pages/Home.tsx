
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, Lock, Vote, FileText } from "lucide-react";
import Layout from "@/components/Layout";

const Home = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Enhanced Quantum-Resistant Voting System</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A blockchain-based electronic voting system with quantum-resistant cryptography for secure and verifiable elections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <ShieldCheck className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Quantum Resistant Cryptography</CardTitle>
              <CardDescription>
                Uses Dilithium post-quantum cryptographic signatures to protect against quantum computer attacks
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <Lock className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Privacy Protection</CardTitle>
              <CardDescription>
                Vote mixing and encryption to protect voter privacy and anonymity
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <Vote className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Offline Voting</CardTitle>
              <CardDescription>
                Support for offline voting with secure verification
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <FileText className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Blockchain Integration</CardTitle>
              <CardDescription>
                Built on Algorand blockchain for transparency and immutability
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-3 transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Register as a voter, create elections, cast votes, and more.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link 
                  to="/register" 
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center justify-center hover:bg-primary/90"
                >
                  Register Voter <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                
                <Link 
                  to="/create-election" 
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center justify-center hover:bg-primary/90"
                >
                  Create Election <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                
                <Link 
                  to="/cast-vote" 
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center justify-center hover:bg-primary/90"
                >
                  Cast Vote <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                
                <Link 
                  to="/offline-vote" 
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center justify-center hover:bg-primary/90"
                >
                  Offline Vote <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
