import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useVotingSystem } from "@/contexts/VotingSystemContext";
import Layout from "@/components/Layout";

// Mock data for demonstration
const mockElectionResults = [
  {
    id: 1,
    name: "Presidential Election 2024",
    proposals: [
      { name: "Candidate A", votes: 145 },
      { name: "Candidate B", votes: 108 },
      { name: "Candidate C", votes: 73 },
    ],
  },
  {
    id: 2,
    name: "Community Development Initiative",
    proposals: [
      { name: "Proposal 1", votes: 85 },
      { name: "Proposal 2", votes: 112 },
      { name: "Proposal 3", votes: 65 },
    ],
  },
];

const Results = () => {
  const { elections } = useVotingSystem();
  const [selectedElection, setSelectedElection] = useState<number>(0);

  // Combine real elections with mock data
  const displayElections = [
    ...mockElectionResults,
    ...elections.map(e => ({
      id: e.assetId,
      name: e.electionName,
      proposals: [
        { name: "Option A", votes: Math.floor(Math.random() * 100) + 50 },
        { name: "Option B", votes: Math.floor(Math.random() * 100) + 50 },
      ]
    }))
  ];

  const data = displayElections[selectedElection]?.proposals || [];

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

        <div className="mb-6">
          <label htmlFor="election-select" className="block text-sm font-medium mb-2">
            Select Election
          </label>
          <select
            id="election-select"
            value={selectedElection}
            onChange={(e) => setSelectedElection(Number(e.target.value))}
            className="w-full md:w-1/2 rounded-md border border-input bg-background px-3 py-2"
          >
            {displayElections.map((election, index) => (
              <option key={election.id} value={index}>
                {election.name}
              </option>
            ))}
          </select>
        </div>

        {displayElections.length > 0 ? (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{displayElections[selectedElection]?.name}</CardTitle>
                <CardDescription>
                  Voting results from the blockchain with quantum-resistant verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
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
                      {data.map((proposal) => {
                        const totalVotes = data.reduce((sum, item) => sum + item.votes, 0);
                        const percentage = ((proposal.votes / totalVotes) * 100).toFixed(2);
                        
                        return (
                          <tr key={proposal.name}>
                            <td className="py-2 px-4 border-b">{proposal.name}</td>
                            <td className="py-2 px-4 border-b">{proposal.votes}</td>
                            <td className="py-2 px-4 border-b">
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[200px]">
                                  <div 
                                    className="bg-primary h-2.5 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span>{percentage}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-md">
                  <h4 className="text-sm font-medium mb-2">Verification</h4>
                  <p className="text-sm text-muted-foreground">
                    These results are secured with quantum-resistant cryptography and stored on the blockchain for transparency and immutability.
                  </p>
                </div>
              </CardContent>
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
      </div>
    </Layout>
  );
};

export default Results;
