import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useVotingSystem } from "@/contexts/VotingSystemContext";
import Layout from "@/components/Layout";

const OfflineVote = () => {
  const { toast } = useToast();
  const { submitOfflineVote, loading, error, currentVoter, elections } = useVotingSystem();
  const [voterId, setVoterId] = useState(currentVoter?.voterId || "");
  const [proposal, setProposal] = useState("");
  const [voteChoice, setVoteChoice] = useState("");
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ voteHash: string; batchId: string } | null>(null);

  const handleSubmitVote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!voterId.trim() || !proposal.trim() || !voteChoice.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const voteData = {
        proposal: proposal.trim(),
        choice: voteChoice.trim(),
        comments: comments.trim(),
        timestamp: new Date().toISOString(),
      };

      const result = await submitOfflineVote({
        voterId: voterId.trim(),
        voteData,
      });

      setResult(result);
      setSubmitted(true);
      toast({
        title: "Vote Submitted",
        description: "Your offline vote has been submitted successfully",
      });
    } catch (err) {
      toast({
        title: "Submission Failed",
        description: error || "Failed to submit offline vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4 max-w-3xl">
        <Link to="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Offline Voting</CardTitle>
            <CardDescription>
              Submit a vote when you are offline or unable to access the blockchain.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!submitted ? (
              <form onSubmit={handleSubmitVote} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="voterId" className="text-sm font-medium">
                    Voter ID
                  </label>
                  <input
                    id="voterId"
                    type="text"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Enter your voter ID"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="proposal" className="text-sm font-medium">
                    Proposal
                  </label>
                  <input
                    id="proposal"
                    type="text"
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Enter proposal name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="voteChoice" className="text-sm font-medium">
                    Your Vote
                  </label>
                  <select
                    id="voteChoice"
                    value={voteChoice}
                    onChange={(e) => setVoteChoice(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="">Select your vote</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="abstain">Abstain</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="comments" className="text-sm font-medium">
                    Comments (Optional)
                  </label>
                  <textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                    placeholder="Additional comments about your vote"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-primary text-primary-foreground flex items-center justify-center w-full py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !voterId.trim() || !proposal.trim() || !voteChoice}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" /> Submit Offline Vote
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="rounded-md bg-green-50 p-4 border border-green-200">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="font-medium text-green-800">Vote Submitted Successfully!</h3>
                  </div>
                  <p className="text-sm text-green-700 mt-2">
                    Your offline vote has been recorded and will be processed when connectivity is available.
                  </p>
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-sm font-medium text-green-800">Vote Hash:</p>
                    <p className="font-mono text-xs sm:text-sm mt-1 bg-white p-2 rounded border border-green-200 break-all">
                      {result?.voteHash}
                    </p>
                    <p className="text-sm font-medium text-green-800 mt-3">Batch ID:</p>
                    <p className="font-mono text-xs sm:text-sm mt-1 bg-white p-2 rounded border border-green-200">
                      {result?.batchId}
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                      Save these values to verify your vote was processed correctly.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-md">
                  <h4 className="text-sm font-medium mb-2">Next Steps</h4>
                  <p className="text-sm text-muted-foreground">
                    Your offline vote will be verified and processed when connectivity is restored.
                    The vote hash can be used to verify that your vote was included in the final tally.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          {submitted && (
            <CardFooter className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setResult(null);
                  setProposal("");
                  setVoteChoice("");
                  setComments("");
                }}
                className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md"
              >
                Submit Another Vote
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

export default OfflineVote;
