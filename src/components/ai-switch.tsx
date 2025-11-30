"use client";
import * as React from "react";
import { Switch } from "@/components/ui/switch";

export const AISwitch = () => {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="ai-consent" />
      <label htmlFor="ai-consent" className="text-sm font-medium">
        AI
      </label>
    </div>
  );
};
