'use client';
import { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
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
import { patients } from '@/lib/data';
import { RiskAnalysisModal } from '@/components/risk-analysis-modal';
import { SummaryModal } from '@/components/summary-modal';
import { ChatModal } from '@/components/chat-modal';
import type { AIRiskAnalysisOutput } from '@/ai/flows/ai-risk-analysis';
import { aiRiskAnalysis } from '@/ai/flows/ai-risk-analysis';
import { generatePatientSummary } from '@/ai/flows/generate-patient-summary';
import type { GeneratePatientSummaryOutput } from '@/ai/flows/generate-patient-summary';

const medicalHistory = [
  {
    date: '10/06/2024',
    diagnosis: 'Hypertension Check-up',
    doctor: 'Dr. Priya Sharma',
    prescription: true,
    labReports: 1,
  },
  {
    date: '15/03/2024',
    diagnosis: 'Minor Laceration',
    doctor: 'Dr. Vikram Rao',
    prescription: false,
    labReports: 0,
  },
  {
    date: '20/11/2023',
    diagnosis: 'Viral Fever',
    doctor: 'Dr. Priya Sharma',
    prescription: true,
    labReports: 0,
  },
];

const labReports = [
  {
    date: '2024-06-10',
    reportName: 'Lipid Profile',
  },
];

export default function PatientDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIRiskAnalysisOutput | null>(null);
  const [isRiskLoading, setIsRiskLoading] = useState(false);

  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summaryResult, setSummaryResult] = useState<GeneratePatientSummaryOutput | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const patient = patients.find(
    (p) => p.patientId === `PID-${id}-2024`
  );

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
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="destructive" onClick={() => handleRiskAnalysis()} disabled={isRiskLoading}>
              <AlertCircle className="mr-2 h-4 w-4" />
              {isRiskLoading ? 'Analyzing...' : 'Risk Analysis'}
            </Button>
            <Button variant="outline" onClick={() => handleGenerateSummary()} disabled={isSummaryLoading}>
              <FileText className="mr-2 h-4 w-4" />
              {isSummaryLoading ? 'Generating...' : 'Generate Summary'}
            </Button>
            <Button variant="outline" onClick={() => setIsChatModalOpen(true)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat with AI
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Record
            </Button>
            <Button>
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
                      <TableCell>{report.date}</TableCell>
                      <TableCell>{report.reportName}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                          <Button variant="link" className="p-0 h-auto">
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
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      {patient && (
        <RiskAnalysisModal
          isOpen={isRiskModalOpen}
          onClose={() => setIsRiskModalOpen(false)}
          analysisResult={analysisResult}
          patientName={patient.name}
          isLoading={isRiskLoading}
          onRegenerate={() => handleRiskAnalysis(true)}
        />
      )}
      {patient && (
        <SummaryModal
          isOpen={isSummaryModalOpen}
          onClose={() => setIsSummaryModalOpen(false)}
          summaryResult={summaryResult}
          patientName={patient.name}
          isLoading={isSummaryLoading}
          onRegenerate={() => handleGenerateSummary(true)}
        />
      )}
      {patient && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          patientId={patient.patientId}
          patientName={patient.name}
        />
      )}
    </div>
  );
}
