
"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoUser, nurseUser, receptionistUser } from "@/lib/data";
import type { UserRole } from "@/lib/types";

export function LoginForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<UserRole>("Doctor");

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you'd verify credentials. Here, we just set the role.
    if (typeof window !== 'undefined') {
      localStorage.setItem('userRole', activeTab);
    }
    router.push('/dashboard');
  };

  return (
    <Tabs defaultValue="Doctor" className="w-full" onValueChange={(value) => setActiveTab(value as UserRole)}>
      <TabsList className="grid w-full grid-cols-3 bg-muted mb-4 p-1 h-auto">
        <TabsTrigger value="Doctor">Doctor</TabsTrigger>
        <TabsTrigger value="Nurse">Nurse</TabsTrigger>
        <TabsTrigger value="Receptionist">Receptionist</TabsTrigger>
      </TabsList>
      <TabsContent value="Doctor">
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
              defaultValue={demoUser.email}
              className="bg-input border-0"
            />
          </div>
          <div className="grid gap-2 text-left">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              defaultValue="password" 
              className="bg-input border-0"
            />
          </div>
          <Button type="submit" className="w-full mt-2">
            Login as Doctor
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="Nurse">
         <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-foreground">Nurse Access</h2>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the nurse dashboard.
          </p>
        </div>
        <form onSubmit={handleLogin} className="grid gap-4">
          <div className="grid gap-2 text-left">
            <Label htmlFor="nurse-email">Email</Label>
            <Input
              id="nurse-email"
              type="email"
              placeholder="nurse@example.com"
              required
              defaultValue={nurseUser.email}
              className="bg-input border-0"
            />
          </div>
          <div className="grid gap-2 text-left">
            <Label htmlFor="nurse-password">Password</Label>
            <Input
              id="nurse-password"
              type="password"
              required
              defaultValue="password"
              className="bg-input border-0"
            />
          </div>
          <Button type="submit" className="w-full mt-2">
            Login as Nurse
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="Receptionist">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-foreground">Receptionist Access</h2>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the reception dashboard.
          </p>
        </div>
        <form onSubmit={handleLogin} className="grid gap-4">
          <div className="grid gap-2 text-left">
            <Label htmlFor="receptionist-email">Email</Label>
            <Input
              id="receptionist-email"
              type="email"
              placeholder="receptionist@example.com"
              required
              defaultValue={receptionistUser.email}
              className="bg-input border-0"
            />
          </div>
          <div className="grid gap-2 text-left">
            <Label htmlFor="receptionist-password">Password</Label>
            <Input
              id="receptionist-password"
              type="password"
              required
              defaultValue="password"
              className="bg-input border-0"
            />
          </div>
          <Button type="submit" className="w-full mt-2">
            Login as Receptionist
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
