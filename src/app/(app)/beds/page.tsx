'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BedIcon, CheckCircle2, PlusCircle, UserPlus } from 'lucide-react';
import { AddBedModal } from '@/components/add-bed-modal';
import { AssignPatientModal } from '@/components/assign-patient-modal';
import type { Bed, Patient } from '@/lib/types';
import { patients as allPatients } from '@/lib/data';
import { Separator } from '@/components/ui/separator';

const initialBeds: Bed[] = [
  {
    bedId: 'Bed 101',
    ward: 'General',
    status: 'Occupied',
    assignedPatientId: 'PID-1-2024',
    assignedPatientName: 'Aarav Sharma',
    assignedPatientAvatarUrl: 'https://picsum.photos/seed/patient1/100/100',
    assignedAt: new Date().toISOString(),
  },
  {
    bedId: 'Bed 102',
    ward: 'General',
    status: 'Available',
  },
  {
    bedId: 'Bed 401',
    ward: 'ICU',
    status: 'Available',
  },
];

export default function BedsPage() {
  const [beds, setBeds] = useState<Bed[]>(initialBeds);
  const [isAddBedModalOpen, setIsAddBedModalOpen] = useState(false);
  const [isAssignPatientModalOpen, setIsAssignPatientModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

  const handleOpenAssignModal = (bed: Bed) => {
    setSelectedBed(bed);
    setIsAssignPatientModalOpen(true);
  };

  const handleAssignPatient = (patient: Patient) => {
    if (selectedBed) {
      setBeds(
        beds.map((b) =>
          b.bedId === selectedBed.bedId
            ? {
                ...b,
                status: 'Occupied',
                assignedPatientId: patient.patientId,
                assignedPatientName: patient.name,
                assignedPatientAvatarUrl: patient.avatarUrl,
                assignedAt: new Date().toISOString(),
              }
            : b
        )
      );
      setIsAssignPatientModalOpen(false);
      setSelectedBed(null);
    }
  };

  const handleDischargePatient = (bedId: string) => {
    setBeds(
      beds.map((b) =>
        b.bedId === bedId
          ? {
              ...b,
              status: 'Available',
              assignedPatientId: undefined,
              assignedPatientName: undefined,
              assignedPatientAvatarUrl: undefined,
              assignedAt: undefined,
            }
          : b
      )
    );
  };

  const handleAddBed = (ward: 'General' | 'ICU' | 'Maternity') => {
    const newBedId = `Bed ${Math.floor(Math.random() * 900) + 100}`;
    const newBed: Bed = {
      bedId: newBedId,
      ward: ward,
      status: 'Available',
    };
    setBeds([...beds, newBed]);
    setIsAddBedModalOpen(false);
  };

  const wards = ['General', 'ICU', 'Maternity'];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bed Management</h1>
          <p className="text-muted-foreground">
            Overview of all hospital beds and their occupancy status.
          </p>
        </div>
        <Button onClick={() => setIsAddBedModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Bed
        </Button>
      </div>

      <div className="space-y-8">
        {wards.map((ward) => (
          <div key={ward}>
            <h2 className="text-2xl font-semibold mb-4">Ward {ward}</h2>
            <Separator className="mb-6" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {beds
                .filter((b) => b.ward === ward)
                .map((bed) =>
                  bed.status === 'Occupied' ? (
                    <Card
                      key={bed.bedId}
                      className="bg-red-500/10 border-red-500/30"
                    >
                      <CardContent className="p-6 flex flex-col items-center justify-center gap-4 text-center">
                        <div className="w-full flex justify-between items-start">
                          <span className="font-semibold">{bed.bedId}</span>
                          <BedIcon className="h-5 w-5 text-red-500/80" />
                        </div>
                        <Avatar className="h-20 w-20 border-4 border-red-500/50">
                          <AvatarImage
                            src={bed.assignedPatientAvatarUrl}
                            alt={bed.assignedPatientName}
                          />
                          <AvatarFallback className="bg-red-500/30 text-red-900 dark:text-red-300">
                            {bed.assignedPatientName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="font-bold text-lg text-foreground">
                            {bed.assignedPatientName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ID: {bed.assignedPatientId}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="mt-2 bg-background hover:bg-muted"
                          onClick={() => handleDischargePatient(bed.bedId)}
                        >
                          Discharge Patient
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card
                      key={bed.bedId}
                      className="bg-green-500/10 border-green-500/30"
                    >
                      <CardContent className="p-6 flex flex-col items-center justify-center gap-4 text-center h-full">
                        <div className="w-full flex justify-between items-start">
                          <span className="font-semibold">{bed.bedId}</span>
                          <BedIcon className="h-5 w-5 text-green-500/80" />
                        </div>
                        <div className="flex-grow flex flex-col items-center justify-center gap-2">
                            <CheckCircle2 className="h-16 w-16 text-green-600" />
                            <p className="font-bold text-lg text-foreground">
                                Available
                            </p>
                        </div>
                        <Button
                          variant="outline"
                          className="mt-2 bg-background hover:bg-muted"
                          onClick={() => handleOpenAssignModal(bed)}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Assign Patient
                        </Button>
                      </CardContent>
                    </Card>
                  )
                )}
            </div>
          </div>
        ))}
      </div>

      <AddBedModal
        isOpen={isAddBedModalOpen}
        onClose={() => setIsAddBedModalOpen(false)}
        onAddBed={handleAddBed}
      />
      <AssignPatientModal
        isOpen={isAssignPatientModalOpen}
        onClose={() => setIsAssignPatientModalOpen(false)}
        onAssignPatient={handleAssignPatient}
        patients={allPatients}
        bedId={selectedBed?.bedId}
      />
    </div>
  );
}
