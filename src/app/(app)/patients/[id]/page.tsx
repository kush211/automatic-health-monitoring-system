
'use client';
import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  FileText,
  MessageSquare,
  PlusCircle,
  Upload,
  User,
  Calendar,
  Phone,
  Home,
  ChevronRight,
  Link as LinkIcon,
  Download,
  FileStack,
} from 'lucide-react';
import { RiskAnalysisModal } from '@/components/risk-analysis-modal';
import { SummaryModal } from '@/components/summary-modal';
import { ChatModal } from '@/components/chat-modal';
import type { AIRiskAnalysisOutput } from '@/ai/flows/ai-risk-analysis';
import { aiRiskAnalysis } from '@/ai/flows/ai-risk-analysis';
import { generatePatientSummary } from '@/ai/flows/generate-patient-summary';
import type { GeneratePatientSummaryOutput } from '@/ai/flows/generate-patient-summary';
import { AddNewRecordModal } from '@/components/add-new-record-modal';
import { PrescriptionModal } from '@/components/prescription-modal';
import { UploadLabReportModal } from '@/components/upload-lab-report-modal';
import { ViewLabReportModal } from '@/components/view-lab-report-modal';
import { MedicalRecordDetailModal } from '@/components/medical-record-detail-modal';
import { useAuth } from '@/hooks/use-auth';
import { useAppContext } from '@/hooks/use-app-context';
import { isToday } from 'date-fns';

const initialMedicalHistory = [
  {
    date: '10/06/2024',
    diagnosis: 'Hypertension Check-up',
    doctor: 'Dr. Priya Sharma',
    prescription: true,
    prescriptionDetails: 'Amlodipine 5mg, 1 tablet daily',
    labReports: 1,
    notes: 'Patient reports feeling well. BP is stable.',
  },
  {
    date: '15/03/2024',
    diagnosis: 'Minor Laceration',
    doctor: 'Dr. Vikram Rao',
    prescription: false,
    prescriptionDetails: '',
    labReports: 0,
    notes: 'Cleaned and dressed wound on left forearm.',
  },
  {
    date: '20/11/2023',
    diagnosis: 'Viral Fever',
    doctor: 'Dr. Priya Sharma',
    prescription: true,
    prescriptionDetails: 'Paracetamol 500mg, as needed for fever.',
    labReports: 0,
    notes: 'Advised rest and hydration.',
  },
];

const sunitaGuptaMedicalHistory = [
    {
      date: '05/05/2024',
      diagnosis: 'Seasonal Allergies',
      doctor: 'Dr. Priya Sharma',
      prescription: true,
      prescriptionDetails: 'Cetirizine 10mg, 1 tablet daily at night',
      labReports: 0,
      notes: 'Patient reports sneezing and itchy eyes. Advised to avoid pollen.',
    },
    {
      date: '10/01/2024',
      diagnosis: 'Annual Physical Exam',
      doctor: 'Dr. Priya Sharma',
      prescription: false,
      prescriptionDetails: '',
      labReports: 0,
      notes: 'Routine check-up. All vitals are normal. Patient is healthy.',
    },
];

const priyaSinghMedicalHistory = [
    {
      date: '12/04/2024',
      diagnosis: 'Common Cold',
      doctor: 'Dr. Priya Sharma',
      prescription: true,
      prescriptionDetails: 'Advised rest, hydration, and Paracetamol if needed.',
      labReports: 0,
      notes: 'Patient presented with symptoms of a common cold. No signs of secondary infection.',
    },
    {
      date: '25/02/2024',
      diagnosis: 'Minor Skin Rash',
      doctor: 'Dr. Vikram Reddy',
      prescription: true,
      prescriptionDetails: 'Hydrocortisone cream 1% to be applied twice daily.',
      labReports: 0,
      notes: 'Localized rash on the forearm, likely contact dermatitis.',
    },
];


const initialLabReports = [
  {
    date: '2024-06-10',
    reportName: 'Lipid Profile',
  },
];

type MedicalRecord = typeof initialMedicalHistory[0];
type LabReport = typeof initialLabReports[0];

export default function PatientDetailPage() {
  const params = useParams();
  const { role } = useAuth();
  const { settings, patients, appointments, updateAppointmentStatus } = useAppContext();
  const id = params.id as string;
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIRiskAnalysisOutput | null>(null);
  const [isRiskLoading, setIsRiskLoading] = useState(false);

  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summaryResult, setSummaryResult] = useState<GeneratePatientSummaryOutput | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isNewRecordModalOpen, setIsNewRecordModalOpen] = useState(false);
  const [isUploadReportModalOpen, setIsUploadReportModalOpen] = useState(false);
  
  // This state will be used to conditionally load initialMedicalHistory for a specific patient
  const [medicalHistory, setMedicalHistory] = useState<MedicalRecord[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<MedicalRecord | null>(null);

  const [isViewReportModalOpen, setIsViewReportModalOpen] = useState(false);
  const [selectedLabReport, setSelectedLabReport] = useState<LabReport | null>(null);

  const [isRecordDetailModalOpen, setIsRecordDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const patient = patients.find(
    (p) => p.patientId === `PID-${id}-2024`
  );

  useEffect(() => {
    if (patient) {
      // Simulate fetching patient-specific data.
      if (patient.patientId === 'PID-1-2024') {
        setMedicalHistory(initialMedicalHistory);
        setLabReports(initialLabReports);
      } else if (patient.patientId === 'PID-4-2024') {
        setMedicalHistory(sunitaGuptaMedicalHistory);
        setLabReports([]);
      } else if (patient.patientId === 'PID-2-2024') {
        setMedicalHistory(priyaSinghMedicalHistory);
        setLabReports([]);
      } else {
        setMedicalHistory([]);
        setLabReports([]);
        // If there are no medical records, automatically open the add new record modal.
        setIsNewRecordModalOpen(true);
      }
    }
  }, [patient]);


  if (!patient) {
    notFound();
  }

  const mockMedicalHistory = `
      Patient Name: ${patient.name}
      Date of Birth: ${patient.dob}
      Gender: ${patient.gender}
      Past Medical History: Hypertension, Diabetes Mellitus.
      Current Symptoms: Severe, crushing chest pain (10/10 intensity) radiating to the left arm and jaw. Associated symptoms include diaphoresis, shortness of breath, and nausea.
      Vitals: BP 160/100, HR 110, RR 22, SpO2 94% on room air.
      Lab Reports: Lipid Profile - Total Cholesterol 240 mg/dL, LDL 160 mg/dL.
    `;

  const handleRiskAnalysis = async (forceRegenerate = false) => {
    if (analysisResult && !forceRegenerate) {
      setIsRiskModalOpen(true);
      return;
    }

    setIsRiskModalOpen(true);
    setIsRiskLoading(true);

    try {
      const result = await aiRiskAnalysis({
        patientMedicalHistory: mockMedicalHistory,
        consentGiven: patient.consent_for_ai,
      });
      setAnalysisResult(result);
    } catch (error) {
      console.error("AI Risk Analysis failed:", error);
    } finally {
      setIsRiskLoading(false);
    }
  };

  const handleGenerateSummary = async (forceRegenerate = false) => {
    if (summaryResult && !forceRegenerate) {
      setIsSummaryModalOpen(true);
      return;
    }

    setIsSummaryModalOpen(true);
    setIsSummaryLoading(true);

    try {
      const result = await generatePatientSummary({
        patientHistory: mockMedicalHistory,
      });
      setSummaryResult(result);
    } catch (error) {
      console.error("AI Summary Generation failed:", error);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleNewRecordAdded = (newRecord: any) => {
    setMedicalHistory(prevHistory => [newRecord, ...prevHistory]);

    // After consultation, update appointment status to 'Completed'
    const today = new Date();
    const activeAppointment = appointments.find(
      (app) =>
        app.patientId === patient.patientId &&
        app.status === 'Arrived' &&
        isToday(new Date(app.dateTime))
    );

    if (activeAppointment) {
      updateAppointmentStatus(activeAppointment.id, 'Completed');
    }
  };
  
  const handleLabReportAdded = (newReport: LabReport) => {
    setLabReports(prevReports => [newReport, ...prevReports]);
  };

  const handleViewPrescription = (record: MedicalRecord) => {
    setSelectedPrescription(record);
    setIsPrescriptionModalOpen(true);
  };

  const handleViewLabReport = (report: LabReport) => {
    setSelectedLabReport(report);
    setIsViewReportModalOpen(true);
  };
  
  const handleViewRecordDetail = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsRecordDetailModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={patient.avatarUrl} alt={patient.name} />
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{patient.name}</h1>
            <p className="text-muted-foreground">Patient ID: {patient.patientId}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          {role === 'Doctor' && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="destructive" onClick={() => handleRiskAnalysis()} disabled={isRiskLoading || !settings.aiRiskAnalysisEnabled}>
                <AlertCircle className="mr-2 h-4 w-4" />
                {isRiskLoading ? 'Analyzing...' : 'Risk Analysis'}
              </Button>
              <Button variant="outline" onClick={() => handleGenerateSummary()} disabled={isSummaryLoading || !settings.aiPatientSummaryEnabled}>
                <FileText className="mr-2 h-4 w-4" />
                {isSummaryLoading ? 'Generating...' : 'Generate Summary'}
              </Button>
              <Button variant="outline" onClick={() => setIsChatModalOpen(true)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat with AI
              </Button>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Button onClick={() => setIsNewRecordModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Record
            </Button>
            <Button onClick={() => setIsUploadReportModalOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Lab Report
            </Button>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-muted-foreground" />
                <span>{patient.gender}</span>
              </div>
              <div className="flex items-center gap-4">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>Born on {new Date(patient.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-4">
                <Home className="h-5 w-5 text-muted-foreground" />
                <span>{patient.address}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileStack className="h-5 w-5" /> Lab Reports</CardTitle>
              <CardDescription>
                All available diagnostic reports for this patient.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {labReports.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Report Name</TableHead>
                    <TableHead className="text-right">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labReports.map((report, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(report.date).toLocaleDateString('en-GB')}</TableCell>
                      <TableCell>{report.reportName}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleViewLabReport(report)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                    No lab reports found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>
                A log of all past diagnoses and treatments.
              </CardDescription>
            </CardHeader>
            <CardContent>
             {medicalHistory.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Prescription</TableHead>
                    <TableHead>Lab Reports</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicalHistory.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.diagnosis}</TableCell>
                      <TableCell>{record.doctor}</TableCell>
                      <TableCell>
                        {record.prescription ? (
                          <Button variant="link" className="p-0 h-auto" onClick={() => handleViewPrescription(record)}>
                            <LinkIcon className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {record.labReports > 0 ? (
                          <Badge variant="secondary">{record.labReports}</Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleViewRecordDetail(record)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                    <p>No medical history found for this patient.</p>
                    <Button variant="link" onClick={() => setIsNewRecordModalOpen(true)}>Add the first record</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {patient && role === 'Doctor' && (
        <RiskAnalysisModal
          isOpen={isRiskModalOpen}
          onClose={() => setIsRiskModalOpen(false)}
          analysisResult={analysisResult}
          patientName={patient.name}
          isLoading={isRiskLoading}
          onRegenerate={() => handleRiskAnalysis(true)}
        />
      )}
      {patient && role === 'Doctor' && (
        <SummaryModal
          isOpen={isSummaryModalOpen}
          onClose={() => setIsSummaryModalOpen(false)}
          summaryResult={summaryResult}
          patientName={patient.name}
          isLoading={isSummaryLoading}
          onRegenerate={() => handleGenerateSummary(true)}
        />
      )}
      {patient && role === 'Doctor' && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          patientId={patient.patientId}
          patientName={patient.name}
          patientMedicalHistory={mockMedicalHistory}
        />
      )}
      {patient && (
        <AddNewRecordModal
          isOpen={isNewRecordModalOpen}
          onClose={() => setIsNewRecordModalOpen(false)}
          patientId={patient.patientId}
          patientName={patient.name}
          onRecordAdded={handleNewRecordAdded}
        />
      )}
       {patient && (
        <UploadLabReportModal
          isOpen={isUploadReportModalOpen}
          onClose={() => setIsUploadReportModalOpen(false)}
          patientId={patient.patientId}
          patientName={patient.name}
          onReportAdded={handleLabReportAdded}
        />
      )}
      {patient && selectedPrescription && (
        <PrescriptionModal
          isOpen={isPrescriptionModalOpen}
          onClose={() => setIsPrescriptionModalOpen(false)}
          patientName={patient.name}
          record={selectedPrescription}
        />
      )}
      {patient && selectedLabReport && (
        <ViewLabReportModal
          isOpen={isViewReportModalOpen}
          onClose={() => setIsViewReportModalOpen(false)}
          patientName={patient.name}
          report={selectedLabReport}
        />
      )}
      {patient && selectedRecord && (
        <MedicalRecordDetailModal
          isOpen={isRecordDetailModalOpen}
          onClose={() => setIsRecordDetailModalOpen(false)}
          patientName={patient.name}
          record={selectedRecord}
        />
      )}
    </div>
  );
}

    

    

