
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { demoUser } from '@/lib/data';
import { Save, KeyRound } from 'lucide-react';
import { useState } from 'react';

export default function AccountPage() {
  const { toast } = useToast();
  const [name, setName] = useState(demoUser.name);
  const [email, setEmail] = useState(demoUser.email);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been saved.',
      });
      setIsSavingProfile(false);
    }, 1500);
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPassword(true);
    setTimeout(() => {
      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully.',
      });
      setIsSavingPassword(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile information.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={demoUser.avatarUrl} alt={demoUser.name} />
                <AvatarFallback>{demoUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xl font-semibold">{name}</p>
                <p className="text-sm text-muted-foreground">{email}</p>
                <p className="text-xs text-muted-foreground mt-1">({demoUser.role})</p>
              </div>
              <Button variant="outline" className="w-full">
                Change Avatar
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 flex flex-col gap-8">
          <Card>
            <form onSubmit={handleProfileSave}>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>
                  Update your name and email address.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button type="submit" disabled={isSavingProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSavingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <form onSubmit={handlePasswordSave}>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  For security, you must provide your current password.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button type="submit" disabled={isSavingPassword}>
                  <KeyRound className="mr-2 h-4 w-4" />
                  {isSavingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
