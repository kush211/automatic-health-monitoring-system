"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { UserRole } from "@/lib/types";

export function LoginForm() {
  const [role, setRole] = useState<UserRole>("Doctor");
  const router = useRouter();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you'd handle authentication here.
    // For this prototype, we'll just redirect to the dashboard.
    router.push('/dashboard');
  };

  const handleRoleChange = (value: string) => {
    setRole(value as UserRole);
  };

  const renderTabContent = (roleName: UserRole) => (
    <TabsContent value={roleName}>
      <form onSubmit={handleLogin} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`${roleName}-email`}>Email</Label>
          <Input
            id={`${roleName}-email`}
            type="email"
            placeholder="m@example.com"
            required
            defaultValue="demo@healthhub.dev"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor={`${roleName}-password`}>Password</Label>
            <a
              href="#"
              className="ml-auto inline-block text-sm underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id={`${roleName}-password`} type="password" required defaultValue="password" />
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Login as {roleName}
        </Button>
      </form>
    </TabsContent>
  );

  return (
    <Tabs defaultValue="Doctor" className="w-full" onValueChange={handleRoleChange}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="Doctor">Doctor</TabsTrigger>
        <TabsTrigger value="Nurse">Nurse</TabsTrigger>
        <TabsTrigger value="Receptionist">Desk</TabsTrigger>
      </TabsList>
      {renderTabContent("Doctor")}
      {renderTabContent("Nurse")}
      {renderTabContent("Receptionist")}
    </Tabs>
  );
}
