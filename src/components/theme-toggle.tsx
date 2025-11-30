"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Tabs value={theme} onValueChange={setTheme} className="h-9">
      <TabsList className="grid h-full w-full grid-cols-3 bg-muted p-1">
        <TabsTrigger value="light" className="h-full">
          <Sun className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Light</span>
        </TabsTrigger>
        <TabsTrigger value="dark" className="h-full">
          <Moon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Dark</span>
        </TabsTrigger>
        <TabsTrigger value="system" className="h-full">
          <Monitor className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">System</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
