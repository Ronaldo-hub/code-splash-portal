
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { vectorDb, DocumentChunk } from "@/utils/vectorDb";
import { initializeContentDatabase } from "@/utils/contentFetcher";
import { Search } from "lucide-react";

const KnowledgeBaseDemo = () => {
  const [documents, setDocuments] = useState<DocumentChunk[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DocumentChunk[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadDocuments = async () => {
      await initializeContentDatabase();
      setDocuments(vectorDb.getAllDocuments());
    };
    
    loadDocuments();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await vectorDb.similaritySearch(searchQuery, 5);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    if (activeTab === "all") return true;
    if (activeTab === "twitter") return doc.source.includes("x.com");
    if (activeTab === "website") return doc.source.includes("carrd.co");
    if (activeTab === "mandate") return doc.source.includes("Mandate");
    return true;
  });

  return (
    <Card className="shadow-sm mt-8">
      <CardHeader>
        <CardTitle className="text-xl">RAG Knowledge Base Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search knowledge base..."
                className="w-full p-2 pr-10 rounded-md border border-input bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All Sources</TabsTrigger>
              <TabsTrigger value="twitter">Twitter</TabsTrigger>
              <TabsTrigger value="website">Website</TabsTrigger>
              <TabsTrigger value="mandate">Mandate</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="border rounded-md p-4 h-[300px] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Search Results:</h3>
                    {searchResults.map((doc) => (
                      <div key={doc.id} className="p-3 bg-muted rounded-md text-sm">
                        <div className="font-medium text-xs text-muted-foreground mb-1">
                          Source: {doc.source} | Date: {doc.date}
                        </div>
                        <p>{doc.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Available Knowledge:</h3>
                    {filteredDocuments.map((doc) => (
                      <div key={doc.id} className="p-3 bg-muted rounded-md text-sm">
                        <div className="font-medium text-xs text-muted-foreground mb-1">
                          Source: {doc.source} | Date: {doc.date}
                        </div>
                        <p>{doc.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="text-xs text-muted-foreground">
            <p>This demo shows the knowledge base used by the RAG system. Enter a search query to see the most relevant documents that would be used to answer your question.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeBaseDemo;
