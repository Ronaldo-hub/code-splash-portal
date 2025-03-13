
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ArrowLeft, PieChart as PieChartIcon, BarChart as BarChartIcon, Download, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useVotingSystem } from "@/contexts/VotingSystemContext";
import Layout from "@/components/Layout";
import { useAPI } from "@/hooks/useAPI";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define types for our data
interface Proposal {
  name: string;
  votes: number;
  percentage: number;
}

interface ElectionResult {
  id: number;
  name: string;
  date: string;
  totalVoters: number;
  turnout: number;
  proposals: Proposal[];
}

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

const Results = () => {
  const { toast } = useToast();
  const { getElectionResults, loading } = useAPI();
  const { elections } = useVotingSystem();
  const [selectedElection, setSelectedElection] = useState<number>(0);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [electionResults, setElectionResults] = useState<ElectionResult[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getElectionResults();
        setElectionResults(data.elections);
      } catch (error) {
        console.error("Failed to fetch results:", error);
        toast({
          title: "Error",
          description: "Failed to fetch election results. Using demo data instead.",
          variant: "destructive",
        });
      }
    };
    
    fetchResults();
  }, []);

  // Combine real elections with mock data
  const displayElections = [...electionResults];

  const currentElection = displayElections[selectedElection];
  const data = currentElection?.proposals || [];

  const downloadResults = () => {
    if (!currentElection) return;
    
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(currentElection, null, 2)
    )}`;
    
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${currentElection.name.replace(/\s+/g, "_")}_results.json`;
    link.click();
    
    toast({
      title: "Results Downloaded",
      description: "Election results have been downloaded as JSON.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <Link to="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Election Results</h1>
          <p className="text-muted-foreground">
            View the results of all elections with quantum-resistant verification.
          </p>
        </div>

        {loading ? (
          <Card className="w-full p-8">
            <div className="flex flex-col items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading election results...</p>
            </div>
          </Card>
        ) : (
          <>
            {displayElections.length > 0 ? (
              <>
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="election-select" className="block text-sm font-medium mb-2">
                      Select Election
                    </label>
                    <select
                      id="election-select"
                      value={selectedElection}
                      onChange={(e) => setSelectedElection(Number(e.target.value))}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      {displayElections.map((election, index) => (
                        <option key={election.id} value={index}>
                          {election.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      variant="outline" 
                      onClick={downloadResults}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Results
                    </Button>
                  </div>
                </div>

                <Card className="mb-8">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{currentElection?.name}</CardTitle>
                        <CardDescription>
                          Voting results from {currentElection?.date} • {currentElection?.totalVoters} eligible voters • {currentElection?.turnout}% turnout
                        </CardDescription>
                      </div>
                      <Tabs 
                        defaultValue="bar" 
                        value={chartType} 
                        onValueChange={(value) => setChartType(value as 'bar' | 'pie')}
                        className="w-auto"
                      >
                        <TabsList>
                          <TabsTrigger value="bar" className="flex items-center gap-1">
                            <BarChartIcon className="h-4 w-4" />
                            Bar
                          </TabsTrigger>
                          <TabsTrigger value="pie" className="flex items-center gap-1">
                            <PieChartIcon className="h-4 w-4" />
                            Pie
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'bar' ? (
                          <BarChart
                            data={data}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 60,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="name" 
                              angle={-45} 
                              textAnchor="end" 
                              tick={{ fontSize: 12 }}
                              height={60}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="votes" fill="#8884d8" name="Votes" />
                          </BarChart>
                        ) : (
                          <PieChart>
                            <Pie
                              data={data}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                              outerRadius={150}
                              fill="#8884d8"
                              dataKey="votes"
                            >
                              {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} votes`, 'Votes']} />
                            <Legend />
                          </PieChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vote Distribution</CardTitle>
                    <CardDescription>
                      Detailed breakdown of votes for each proposal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="text-left py-2 px-4 border-b">Proposal</th>
                            <th className="text-left py-2 px-4 border-b">Votes</th>
                            <th className="text-left py-2 px-4 border-b">Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((proposal) => (
                            <tr key={proposal.name}>
                              <td className="py-2 px-4 border-b">{proposal.name}</td>
                              <td className="py-2 px-4 border-b">{proposal.votes}</td>
                              <td className="py-2 px-4 border-b">
                                <div className="flex items-center">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[200px]">
                                    <div 
                                      className="bg-primary h-2.5 rounded-full" 
                                      style={{ width: `${proposal.percentage}%` }}
                                    ></div>
                                  </div>
                                  <span>{proposal.percentage.toFixed(1)}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted rounded-md">
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Lock className="h-4 w-4" /> Blockchain Verification
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          These results are secured with quantum-resistant cryptography and stored on the Algorand blockchain for transparency and immutability.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-muted rounded-md">
                        <h4 className="text-sm font-medium mb-2">Election Summary</h4>
                        <p className="text-sm text-muted-foreground">
                          Total Votes Cast: {data.reduce((sum, item) => sum + item.votes, 0)} <br />
                          Eligible Voters: {currentElection?.totalVoters} <br />
                          Voter Turnout: {currentElection?.turnout}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button asChild variant="outline">
                      <Link to="/create-election">Create a New Election</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-10">
                  <div className="text-center">
                    <p className="mb-4">No election results available yet.</p>
                    <Link 
                      to="/create-election" 
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-md inline-flex items-center hover:bg-primary/90"
                    >
                      Create an Election
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Results;
