
import React from "react";
import OpenRouterSettings from "./settings/OpenRouterSettings";
import XApiSettings from "./settings/XApiSettings";
import DatabaseSettings from "./settings/DatabaseSettings";

const ApiSettings = () => {
  return (
    <div className="space-y-6">
      <OpenRouterSettings />
      <XApiSettings />
      <DatabaseSettings />
    </div>
  );
};

export default ApiSettings;
