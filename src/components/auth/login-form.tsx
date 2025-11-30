"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LoginForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("doctor");

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push('/dashboard');
  };

  return (
    <Tabs defaultValue="doctor" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3 bg-secondary mb-4">
        <TabsTrigger value="doctor">Doctor</TabsTrigger>
        <TabsTrigger value="nurse">Nurse</TabsTrigger>
        <TabsTrigger value="receptionist">Receptionist</TabsTrigger>
      </TabsList>
      <TabsContent value="doctor">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-foreground">Doctor Access</h2>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the full dashboard.
          </p>
        </div>
        <form onSubmit={handleLogin} className="grid gap-4">
          <div className="grid gap-2 text-left">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              defaultValue="priya.sharma@example.com"
            />
          </div>
          <div className="grid gap-2 text-left">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              defaultValue="password" 
            />
          </div>
          <Button type="submit" className="w-full mt-2">
            Login as Doctor
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="nurse">
        {/* Nurse login form can be added here */}
      </TabsContent>
      <TabsContent value="receptionist">
        {/* Receptionist login form can be added here */}
      </TabsContent>
    </Tabs>
  );
}
