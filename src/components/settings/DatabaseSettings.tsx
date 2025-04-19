
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RefreshCwIcon } from "lucide-react";
import { updateContentDatabase } from "@/utils/contentFetcher";
import { toast } from "sonner";

const DatabaseSettings = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateDatabase = async () => {
    setIsUpdating(true);
    try {
      const success = await updateContentDatabase();
      if (success) {
        toast.success("Content database updated successfully");
      } else {
        toast.error("Failed to update content database");
      }
    } catch (error) {
      console.error("Error updating database:", error);
      toast.error("Failed to update content database");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCwIcon className="h-5 w-5" />
          Content Database
        </CardTitle>
        <CardDescription>
          Manage the content database used for retrieving information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleUpdateDatabase} 
          disabled={isUpdating}
          className="w-full"
        >
          {isUpdating ? (
            <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCwIcon className="h-4 w-4 mr-2" />
          )}
          {isUpdating ? "Updating Database..." : "Update Content Database"}
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          This will fetch the latest content from the X profile and website to update the knowledge base.
        </p>
      </CardContent>
    </Card>
  );
};

export default DatabaseSettings;
