
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BedIcon, CheckCircle2, PlusCircle, UserPlus } from 'lucide-react';
import { AddBedModal } from '@/components/add-bed-modal';
import { AssignPatientModal } from '@/components/assign-patient-modal';
import { DischargeSummaryModal } from '@/components/discharge-summary-modal';
import type { Bed, Patient } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import type { GenerateDischargeSummaryOutput } from '@/ai/flows/generate-discharge-summary';
import { generateDischargeSummary } from '@/ai/flows/generate-discharge-summary';
import { useAppContext } from '@/hooks/use-app-context';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function BedsPage() {
  const { beds, addBed, assignPatientToBed, dischargePatientFromBed, patients } = useAppContext();
  const { role } = useAuth();
  const { toast } = useToast();
  const [isAddBedModalOpen, setIsAddBedModalOpen] = useState(false);
  const [isAssignPatientModalOpen, setIsAssignPatientModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

  // State for discharge summary
  const [isDischargeModalOpen, setIsDischargeModalOpen] = useState(false);
  const [bedToDischarge, setBedToDischarge] = useState<Bed | null>(null);
  const [dischargeSummary, setDischargeSummary] = useState<GenerateDischargeSummaryOutput | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const handleOpenAssignModal = (bed: Bed) => {
    setSelectedBed(bed);
    setIsAssignPatientModalOpen(true);
  };

  const handleAssignPatient = (patient: Patient) => {
    if (selectedBed) {
      assignPatientToBed(selectedBed.bedId, patient);
      setIsAssignPatientModalOpen(false);
      setSelectedBed(null);
    }
  };

  const handleOpenDischargeModal = async (bed: Bed) => {
    setBedToDischarge(bed);
    setIsDischargeModalOpen(true);
    setIsSummaryLoading(true);

    try {
        const mockMedicalHistory = `
        Patient admitted with symptoms of Acute Myocardial Infarction.
        Vitals: BP 160/100, HR 110, RR 22, SpO2 94%.
        Treatment: Administered aspirin, nitroglycerin, and morphine. Underwent successful coronary angioplasty.
        Post-procedure: Monitored in ICU, vitals stabilized. Patient responded well to treatment.
        Lab Reports: Lipid Profile - Total Cholesterol 240 mg/dL, LDL 160 mg/dL.
        Condition at Discharge: Stable, pain-free, and ambulatory.
      `;
      const result = await generateDischargeSummary({
        patientName: bed.assignedPatientName!,
        admissionDate: new Date(bed.assignedAt!).toLocaleDateString(),
        dischargeDate: new Date().toLocaleDateString(),
        medicalHistory: mockMedicalHistory,
      });
      setDischargeSummary(result);
    } catch (error) {
        console.error("Failed to generate discharge summary:", error);
        // Handle error state in UI if needed
    } finally {
        setIsSummaryLoading(false);
    }
  };

  const handleConfirmDischarge = (bedId: string) => {
    const bed = beds.find((b) => b.bedId === bedId);
    const patientName = bed?.assignedPatientName;

    dischargePatientFromBed(bedId);
    handleCloseDischargeModal();

    if (patientName) {
      toast({
        title: 'Patient Discharged',
        description: `${patientName} has been discharged and sent to billing.`,
      });
    }
  };
  
  const handleCloseDischargeModal = () => {
    setIsDischargeModalOpen(false);
    setBedToDischarge(null);
    setDischargeSummary(null);
    setIsSummaryLoading(false);
  }

  const handleAddBed = (ward: 'General' | 'ICU' | 'Maternity') => {
    addBed(ward);
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
        {role === 'Doctor' && (
            <Button onClick={() => setIsAddBedModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Bed
            </Button>
        )}
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
                        {(role === 'Doctor' || role === 'Nurse') && (
                            <Button
                            variant="outline"
                            className="mt-2 bg-background hover:bg-muted"
                            onClick={() => handleOpenDischargeModal(bed)}
                            >
                            Discharge Patient
                            </Button>
                        )}
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
                        {(role === 'Doctor' || role === 'Nurse') && (
                            <Button
                            variant="outline"
                            className="mt-2 bg-background hover:bg-muted"
                            onClick={() => handleOpenAssignModal(bed)}
                            >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Assign Patient
                            </Button>
                        )}
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
        patients={patients}
        bedId={selectedBed?.bedId}
      />
      {bedToDischarge && (role === 'Doctor' || role === 'Nurse') && (
        <DischargeSummaryModal
          isOpen={isDischargeModalOpen}
          onClose={handleCloseDischargeModal}
          summary={dischargeSummary}
          isLoading={isSummaryLoading}
          onConfirmDischarge={() => handleConfirmDischarge(bedToDischarge.bedId)}
        />
      )}
    </div>
  );
}
