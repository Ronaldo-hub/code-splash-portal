import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useVotingSystem } from "@/contexts/VotingSystemContext";
import Layout from "@/components/Layout";

const CastVote = () => {
  const { toast } = useToast();
  const { castVote, loading, error, currentVoter, elections } = useVotingSystem();
  const [assetId, setAssetId] = useState<number>(elections[0]?.assetId || 0);
  const [votingPower, setVotingPower] = useState(1);
  const [proposalAddress, setProposalAddress] = useState("");
  const [voted, setVoted] = useState(false);
  const [batchId, setBatchId] = useState<string | null>(null);

  const handleCastVote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!proposalAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid proposal address",
        variant: "destructive",
      });
      return;
    }

    if (!currentVoter) {
      toast({
        title: "Error",
        description: "You need to register as a voter first",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await castVote({
        voterId: currentVoter.voterId,
        assetId: assetId,
        votingPower: votingPower,
        proposalAddress: proposalAddress.trim(),
      });

      setBatchId(result);
      setVoted(true);
      toast({
        title: "Vote Cast",
        description: "Your vote has been cast successfully",
      });
    } catch (err) {
      toast({
        title: "Vote Failed",
        description: error || "Failed to cast vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!currentVoter) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Cast Your Vote</CardTitle>
            <CardDescription>
              You need to register as a voter first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="mb-4">Please register as a voter to cast a vote.</p>
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
            <CardTitle>Cast Your Vote</CardTitle>
            <CardDescription>
              Vote securely with quantum-resistant cryptography.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!voted ? (
              <form onSubmit={handleCastVote} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="assetId" className="text-sm font-medium">
                    Election (Asset ID)
                  </label>
                  {elections.length > 0 ? (
                    <select
                      id="assetId"
                      value={assetId}
                      onChange={(e) => setAssetId(Number(e.target.value))}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    >
                      {elections.map((election) => (
                        <option key={election.assetId} value={election.assetId}>
                          {election.electionName} ({election.assetId})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="space-y-2">
                      <input
                        id="assetId"
                        type="number"
                        min="1"
                        value={assetId}
                        onChange={(e) => setAssetId(Number(e.target.value))}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="Enter election asset ID"
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        <Link to="/create-election" className="text-primary hover:underline">Create an election</Link> if you don't have an Asset ID.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="votingPower" className="text-sm font-medium">
                    Voting Power
                  </label>
                  <input
                    id="votingPower"
                    type="number"
                    min="1"
                    value={votingPower}
                    onChange={(e) => setVotingPower(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of votes to cast.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="proposalAddress" className="text-sm font-medium">
                    Proposal Address
                  </label>
                  <input
                    id="proposalAddress"
                    type="text"
                    value={proposalAddress}
                    onChange={(e) => setProposalAddress(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Enter proposal address"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    The blockchain address of the proposal you are voting for.
                  </p>
                </div>

                <button
                  type="submit"
                  className="bg-primary text-primary-foreground flex items-center justify-center w-full py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !proposalAddress.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Casting Vote...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" /> Cast Vote
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="rounded-md bg-green-50 p-4 border border-green-200">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="font-medium text-green-800">Vote Cast Successfully!</h3>
                  </div>
                  <p className="text-sm text-green-700 mt-2">
                    Your vote has been securely cast and is being processed by the system.
                  </p>
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-sm font-medium text-green-800">Batch ID:</p>
                    <p className="font-mono text-sm mt-1 bg-white p-2 rounded border border-green-200">
                      {batchId}
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                      Save this batch ID to track the status of your vote.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-md">
                  <h4 className="text-sm font-medium mb-2">Next Steps</h4>
                  <p className="text-sm text-muted-foreground">
                    Your vote will be mixed with other votes to ensure privacy before being processed on the blockchain.
                    This process may take a few minutes to complete.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          {voted && (
            <CardFooter className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setVoted(false);
                  setBatchId(null);
                  setProposalAddress("");
                }}
                className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md"
              >
                Cast Another Vote
              </button>
              <Link 
                to="/" 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Return Home
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default CastVote;
