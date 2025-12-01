
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Calendar, Phone, Home, User as UserIcon, VenusMars } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/hooks/use-app-context';
import type { Patient } from '@/lib/types';
import { doctors } from '@/lib/data';

export default function NewPatientPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addPatient } = useAppContext();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '' as 'Male' | 'Female' | 'Other',
    phone: '',
    address: '',
    primaryDoctorId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dob || !formData.gender || !formData.primaryDoctorId) {
        toast({
            title: "Missing Information",
            description: "Please fill out all required fields.",
            variant: "destructive"
        });
        return;
    }

    setIsSaving(true);
    
    const newPatientData = {
        name: formData.name,
        dob: formData.dob,
        gender: formData.gender,
        phone: formData.phone,
        address: formData.address,
        primaryDoctorId: formData.primaryDoctorId,
    };

    addPatient(newPatientData);

    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
        title: "Patient Registered",
        description: `${formData.name} has been successfully added to the system.`,
    });

    setIsSaving(false);
    router.push('/patients');
  };

  return (
    <div className="flex flex-col gap-8">
       <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <UserPlus className="h-7 w-7" />
            New Patient Registration
        </h1>
        <p className="text-muted-foreground">
          Enter the details for the new patient below.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
            <CardHeader>
                <CardTitle>Patient Details</CardTitle>
                <CardDescription>All fields marked with an asterisk (*) are required.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Jane Doe" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select name="gender" onValueChange={(value) => handleSelectChange('gender', value)} required>
                        <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="e.g., +91-9876543210" />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="e.g., 123 Health St, Wellness City" />
                </div>
                 <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="primaryDoctorId">Primary Doctor *</Label>
                     <Select name="primaryDoctorId" onValueChange={(value) => handleSelectChange('primaryDoctorId', value)} required>
                        <SelectTrigger id="primaryDoctorId">
                            <SelectValue placeholder="Assign a primary doctor" />
                        </SelectTrigger>
                        <SelectContent>
                            {doctors.map(doc => (
                                <SelectItem key={doc.uid} value={doc.uid}>{doc.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
        <div className='flex justify-end mt-6'>
            <Button size="lg" type="submit" disabled={isSaving}>
                <UserPlus className='mr-2 h-4 w-4'/>
                {isSaving ? 'Registering Patient...' : 'Register Patient'}
            </Button>
       </div>
      </form>
    </div>
  );
}
