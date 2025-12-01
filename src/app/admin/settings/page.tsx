
'use client';

import { useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { SlidersHorizontal, Save, BrainCircuit, DatabaseZap, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function SystemSettingsPage() {
  const { toast } = useToast();

  // State for clinic info
  const [clinicName, setClinicName] = useState('HealthHub Rural Clinic');
  const [clinicAddress, setClinicAddress] = useState('123 Health St, Wellness City, 12345');
  const [clinicPhone, setClinicPhone] = useState('+91-1234567890');
  const [isSavingInfo, setIsSavingInfo] = useState(false);

  // State for AI features
  const [aiRiskAnalysis, setAiRiskAnalysis] = useState(true);
  const [aiPatientSummary, setAiPatientSummary] = useState(true);
  const [isSavingAi, setIsSavingAi] = useState(false);
  
  const handleInfoSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingInfo(true);
    setTimeout(() => {
      toast({
        title: 'Information Updated',
        description: 'Clinic details have been saved.',
      });
      setIsSavingInfo(false);
    }, 1500);
  };
  
  const handleAiSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAi(true);
    setTimeout(() => {
      toast({
        title: 'AI Settings Updated',
        description: 'AI feature configuration has been saved.',
      });
      setIsSavingAi(false);
    }, 1500);
  };

  const handleClearData = () => {
    // In a real app, you might want to be more specific, but for a demo, localStorage is fine.
    localStorage.clear();
    toast({
        title: 'Application Data Cleared',
        description: 'All local data has been reset. Please refresh the page.',
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <SlidersHorizontal className="h-7 w-7" />
          System Settings
        </h1>
        <p className="text-muted-foreground">
          Manage global application settings and configurations.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Clinic Information Card */}
        <Card>
          <form onSubmit={handleInfoSave}>
            <CardHeader>
              <CardTitle>Clinic Information</CardTitle>
              <CardDescription>
                Update the general information for the clinic.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinic-name">Clinic Name</Label>
                <Input
                  id="clinic-name"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinic-address">Address</Label>
                <Input
                  id="clinic-address"
                  value={clinicAddress}
                  onChange={(e) => setClinicAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinic-phone">Phone Number</Label>
                <Input
                  id="clinic-phone"
                  value={clinicPhone}
                  onChange={(e) => setClinicPhone(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button type="submit" disabled={isSavingInfo}>
                <Save className="mr-2 h-4 w-4" />
                {isSavingInfo ? 'Saving...' : 'Save Information'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* AI Features Card */}
        <Card>
          <form onSubmit={handleAiSave}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit /> AI Features
              </CardTitle>
              <CardDescription>
                Enable or disable AI-powered assistance features globally.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="ai-risk-analysis" className="text-base">
                    Patient Risk Analysis
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow doctors to run AI-based risk assessments.
                  </p>
                </div>
                <Switch
                  id="ai-risk-analysis"
                  checked={aiRiskAnalysis}
                  onCheckedChange={setAiRiskAnalysis}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="ai-patient-summary" className="text-base">
                    Patient Summary Generation
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow doctors to generate quick summaries of patient history.
                  </p>
                </div>
                <Switch
                  id="ai-patient-summary"
                  checked={aiPatientSummary}
                  onCheckedChange={setAiPatientSummary}
                />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button type="submit" disabled={isSavingAi}>
                <Save className="mr-2 h-4 w-4" />
                {isSavingAi ? 'Saving...' : 'Save AI Settings'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Data Management Card */}
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <DatabaseZap /> Data Management
            </CardTitle>
            <CardDescription>
              Manage the application's stored data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
                <div>
                    <Label htmlFor="clear-data" className="text-base font-semibold">
                        Clear Application Data
                    </Label>
                    <p className="text-sm text-muted-foreground">
                        This will reset all appointments, beds, and billing to their initial state.
                    </p>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" id="clear-data">
                            <AlertTriangle className="mr-2 h-4 w-4" /> Reset Data
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete all
                            application data from your local browser storage, including appointments,
                            bed assignments, and billing information.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearData}>
                            Yes, clear all data
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
