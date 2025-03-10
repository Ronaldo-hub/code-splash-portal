import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Save, Copy, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useVotingSystem } from "@/contexts/VotingSystemContext";
import Layout from "@/components/Layout";

const CreateElection = () => {
  const { toast } = useToast();
  const { createElection, loading, error, currentVoter } = useVotingSystem();
  const [electionName, setElectionName] = useState("");
  const [totalVotes, setTotalVotes] = useState(100);
  const [threshold, setThreshold] = useState(2);
  const [isCreated, setIsCreated] = useState(false);
  const [electionResult, setElectionResult] = useState<any>(null);

  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!electionName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid election name",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real implementation, this would use the actual voter credentials
      const multisigAdmin = {
        address: `ADMIN${Math.random().toString(36).substring(2, 15)}`,
        threshold: threshold,
      };

      const result = await createElection({
        electionName: electionName.trim(),
        totalVotes: totalVotes,
      });

      setElectionResult(result);
      setIsCreated(true);
      toast({
        title: "Election Created",
        description: "Your election has been created successfully",
      });
    } catch (err) {
      toast({
        title: "Creation Failed",
        description: error || "Failed to create election. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`,
    });
  };

  if (!currentVoter) {
    return (
      <Layout>
        <div className="container mx-auto py-10 px-4 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Create an Election</CardTitle>
              <CardDescription>
                You need to register as a voter first to create an election.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="mb-4">Please register as a voter to continue.</p>
                <Link 
                  to="/register" 
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md inline-flex items-center hover:bg-primary/90"
                >
                  Register Now
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4 max-w-3xl">
        <Link to="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create an Election</CardTitle>
            <CardDescription>
              Set up a new quantum-secure election on the blockchain.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isCreated ? (
              <form onSubmit={handleCreateElection} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="electionName" className="text-sm font-medium">
                    Election Name
                  </label>
                  <input
                    id="electionName"
                    type="text"
                    value={electionName}
                    onChange={(e) => setElectionName(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Enter election name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="totalVotes" className="text-sm font-medium">
                    Total Votes
                  </label>
                  <input
                    id="totalVotes"
                    type="number"
                    min="1"
                    value={totalVotes}
                    onChange={(e) => setTotalVotes(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Total number of voting tokens to create.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="threshold" className="text-sm font-medium">
                    Multi-signature Threshold
                  </label>
                  <input
                    id="threshold"
                    type="number"
                    min="1"
                    max="10"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of signatures required for administrative operations.
                  </p>
                </div>

                <button
                  type="submit"
                  className="bg-primary text-primary-foreground flex items-center justify-center w-full py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !electionName.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Create Election
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-medium mb-2">Election Created Successfully!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your election has been created. Please save the following information.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Election Name:</p>
                      <div className="flex items-center justify-between bg-background rounded-md p-2">
                        <code>{electionResult?.electionName}</code>
                        <button
                          onClick={() => copyToClipboard(electionResult?.electionName, "Election Name")}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium">Asset ID:</p>
                      <div className="flex items-center justify-between bg-background rounded-md p-2">
                        <code>{electionResult?.assetId}</code>
                        <button
                          onClick={() => copyToClipboard(String(electionResult?.assetId), "Asset ID")}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium">Total Votes:</p>
                      <div className="flex items-center justify-between bg-background rounded-md p-2">
                        <code>{electionResult?.totalVotes}</code>
                        <button
                          onClick={() => copyToClipboard(String(electionResult?.totalVotes), "Total Votes")}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 border border-green-200 rounded-md mt-4">
                      <p className="text-sm text-green-800">
                        The election asset has been created on the blockchain. You can now distribute votes to eligible voters.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          {isCreated && (
            <CardFooter className="flex justify-end space-x-4">
              <Link 
                to="/cast-vote" 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center hover:bg-primary/90"
              >
                Go to Cast Vote
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default CreateElection;
