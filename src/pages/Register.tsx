import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Save, Copy, ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useVotingSystem } from "@/contexts/VotingSystemContext";
import Layout from "@/components/Layout";

const Register = () => {
  const { toast } = useToast();
  const { registerVoter, loading, error } = useVotingSystem();
  const [voterId, setVoterId] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<any>(null);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [acknowledgedDataStorage, setAcknowledgedDataStorage] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!voterId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Voter ID",
        variant: "destructive",
      });
      return;
    }

    if (!acknowledgedDataStorage) {
      toast({
        title: "Error",
        description: "Please acknowledge the data storage notice",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await registerVoter(voterId.trim());
      setRegistrationResult(result);
      setIsRegistered(true);
      toast({
        title: "Registration Successful",
        description: "Your voter account has been created",
      });
    } catch (err) {
      toast({
        title: "Registration Failed",
        description: error || "Failed to register voter. Please try again.",
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

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4 max-w-3xl">
        <Link to="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Register as a Voter</CardTitle>
            <CardDescription>
              Create a quantum-resistant voting account to participate in elections securely.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isRegistered ? (
              <form onSubmit={handleRegister} className="space-y-6">
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
                  <p className="text-sm text-muted-foreground">
                    This ID will be used to identify you in the voting system.
                  </p>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acknowledge"
                    checked={acknowledgedDataStorage}
                    onCheckedChange={(checked) => 
                      setAcknowledgedDataStorage(checked as boolean)
                    }
                  />
                  <label htmlFor="acknowledge" className="text-sm text-muted-foreground">
                    I understand that I must securely store my keys. If lost, I will not be able to participate in voting.
                  </label>
                </div>

                <button
                  type="submit"
                  className="bg-primary text-primary-foreground flex items-center justify-center w-full py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !voterId.trim() || !acknowledgedDataStorage}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Register
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-medium mb-2">Registration Successful!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your voting account has been created. Please save the following information securely.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Voter ID:</p>
                      <div className="flex items-center justify-between bg-background rounded-md p-2">
                        <code>{registrationResult?.voterId}</code>
                        <button
                          onClick={() => copyToClipboard(registrationResult?.voterId, "Voter ID")}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium">Algorand Address:</p>
                      <div className="flex items-center justify-between bg-background rounded-md p-2">
                        <code className="text-xs sm:text-sm break-all">{registrationResult?.algoAddress}</code>
                        <button
                          onClick={() => copyToClipboard(registrationResult?.algoAddress, "Algorand Address")}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium">Algorand Mnemonic:</p>
                      <div className="flex items-center justify-between bg-background rounded-md p-2">
                        <code className="text-xs sm:text-sm break-all">{registrationResult?.algoMnemonic}</code>
                        <button
                          onClick={() => copyToClipboard(registrationResult?.algoMnemonic, "Algorand Mnemonic")}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center text-sm font-medium text-primary hover:underline">
                        {showSensitiveData ? "Hide" : "Show"} Sensitive Keys
                        <span className={`ml-1 transition-transform duration-200 ${showSensitiveData ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-4 mt-4">
                        <div>
                          <p className="text-sm font-medium">Quantum Public Key:</p>
                          <div className="flex items-center justify-between bg-background rounded-md p-2">
                            <code className="text-xs sm:text-sm break-all">{registrationResult?.pqPublicKey}</code>
                            <button
                              onClick={() => copyToClipboard(registrationResult?.pqPublicKey || "", "Quantum Public Key")}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium">Quantum Private Key:</p>
                          <div className="flex items-center justify-between bg-background rounded-md p-2">
                            <code className="text-xs sm:text-sm break-all">{registrationResult?.pqPrivateKey}</code>
                            <button
                              onClick={() => copyToClipboard(registrationResult?.pqPrivateKey || "", "Quantum Private Key")}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mt-4">
                          <p className="text-sm text-yellow-800">
                            <strong>Warning:</strong> These keys provide access to your voting account. Store them securely and never share them with anyone.
                          </p>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          {isRegistered && (
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

export default Register;
