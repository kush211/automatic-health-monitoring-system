

'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Appointment, Bed, Bill, Patient, User, AppSettings } from '@/lib/types';
import { appointments as initialAppointments, initialPatients, doctors, initialBeds } from '@/lib/data';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

interface NewAppointmentPayload {
    patient: Patient;
    doctor: User;
    dateTime: string;
    status?: 'Scheduled' | 'Arrived';
}

interface NewPatientPayload {
    name: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other';
    phone: string;
    address: string;
    primaryDoctorId: string;
}

const initialSettings: AppSettings = {
    aiRiskAnalysisEnabled: true,
    aiPatientSummaryEnabled: true,
};

interface AppContextType {
  appointments: Appointment[];
  beds: Bed[];
  patients: Patient[];
  dischargedPatientsForBilling: Patient[];
  billedPatients: Bill[];
  settings: AppSettings;
  transferAppointment: (appointmentId: string, newDoctor: User) => void;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
  addAppointment: (payload: NewAppointmentPayload) => void;
  addPatient: (payload: NewPatientPayload) => void;
  addBed: (ward: 'General' | 'ICU' | 'Maternity') => void;
  assignPatientToBed: (bedId: string, patient: Patient) => void;
  dischargePatientFromBed: (bedId: string) => void;
  generateBillForPatient: (patientId: string, billDetails: Omit<Bill, 'id' | 'billId' | 'status' | 'generatedAt' | 'generatedBy'>) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialState = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') {
        return fallback;
    }
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (error) {
        console.error(`Error reading from localStorage for key "${key}":`, error);
        return fallback;
    }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { firestore } = useFirebase();

  const patientsRef = useMemoFirebase(() => collection(firestore, 'patients'), [firestore]);
  const { data: patients = [] } = useCollection<Patient>(patientsRef);

  const appointmentsRef = useMemoFirebase(() => collection(firestore, 'appointments'), [firestore]);
  const { data: appointments = [] } = useCollection<Appointment>(appointmentsRef);
  
  const bedsRef = useMemoFirebase(() => collection(firestore, 'beds'), [firestore]);
  const { data: beds = [] } = useCollection<Bed>(bedsRef);

  const [dischargedPatientsForBilling, setDischargedPatientsForBilling] = useState<Patient[]>(() => getInitialState('dischargedPatients', []));
  const [billedPatients, setBilledPatients] = useState<Bill[]>(() => getInitialState('billedPatients', []));
  const [settings, setSettings] = useState<AppSettings>(() => getInitialState('appSettings', initialSettings));

  useEffect(() => {
    try {
        window.localStorage.setItem('dischargedPatients', JSON.stringify(dischargedPatientsForBilling));
    } catch (error) {
        console.error("Failed to save discharged patients to localStorage:", error);
    }
  }, [dischargedPatientsForBilling]);

  useEffect(() => {
    try {
        window.localStorage.setItem('billedPatients', JSON.stringify(billedPatients));
    } catch (error) {
        console.error("Failed to save billed patients to localStorage:", error);
    }
  }, [billedPatients]);

  useEffect(() => {
    try {
        window.localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
        console.error("Failed to save settings to localStorage:", error);
    }
  }, [settings]);

  const transferAppointment = async (appointmentId: string, newDoctor: User) => {
    const appointmentRef = doc(firestore, 'appointments', appointmentId);
    await updateDoc(appointmentRef, {
        doctorId: newDoctor.uid,
        doctorName: newDoctor.name,
    });
  };

  const updateAppointmentStatus = async (appointmentId: string, status: Appointment['status']) => {
    const appointmentRef = doc(firestore, 'appointments', appointmentId);
    await updateDoc(appointmentRef, { status });
  };
  
  const addAppointment = async ({ patient, doctor, dateTime, status = 'Scheduled' }: NewAppointmentPayload) => {
    const newAppointment: Omit<Appointment, 'id'> = {
        patientId: patient.patientId,
        patientName: patient.name,
        patientAvatarUrl: patient.avatarUrl,
        doctorId: doctor.uid,
        doctorName: doctor.name,
        dateTime,
        status,
        createdBy: 'rec1', // Hardcoded for demo
        createdAt: new Date().toISOString(),
    };
    const appointmentsCollection = collection(firestore, 'appointments');
    await addDoc(appointmentsCollection, newAppointment);
  };
  
  const addPatient = async (payload: NewPatientPayload) => {
    const newPatientId = `PID-${patients.length + 1}-${new Date().getFullYear()}`;
    const primaryDoctor = doctors.find(d => d.uid === payload.primaryDoctorId);
    const newPatient: Omit<Patient, 'id'> = {
        ...payload,
        patientId: newPatientId,
        primaryDoctorName: primaryDoctor?.name || 'Unassigned',
        avatarUrl: `https://picsum.photos/seed/${newPatientId}/100/100`,
        consent_for_ai: true, // Defaulting to true for demo purposes
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const patientsCollection = collection(firestore, 'patients');
    await addDoc(patientsCollection, newPatient);
  };

  const addBed = async (ward: 'General' | 'ICU' | 'Maternity') => {
    const newBedId = `Bed ${Math.floor(Math.random() * 900) + 100}`;
    const newBed: Omit<Bed, 'id'> = {
      bedId: newBedId,
      ward: ward,
      status: 'Available',
    };
    const bedsCollection = collection(firestore, 'beds');
    await addDoc(bedsCollection, newBed);
  };

  const assignPatientToBed = async (bedId: string, patient: Patient) => {
    const bed = beds.find(b => b.id === bedId);
    if (!bed) return;
    const bedRef = doc(firestore, 'beds', bed.id);
    await updateDoc(bedRef, {
        status: 'Occupied',
        assignedPatientId: patient.patientId,
        assignedPatientName: patient.name,
        assignedPatientAvatarUrl: patient.avatarUrl,
        assignedAt: new Date().toISOString(),
    });
  };

  const dischargePatientFromBed = (bedId: string) => {
    const bedToDischarge = beds.find(b => b.id === bedId);
    if (bedToDischarge && bedToDischarge.assignedPatientId) {
        const patientToBill = patients.find(p => p.patientId === bedToDischarge.assignedPatientId);
        if (patientToBill && !dischargedPatientsForBilling.find(p => p.patientId === patientToBill.patientId)) {
            setDischargedPatientsForBilling(prev => [...prev, patientToBill]);
        }
    }

    const bedRef = doc(firestore, 'beds', bedId);
    updateDoc(bedRef, {
        status: 'Available',
        assignedPatientId: null,
        assignedPatientName: null,
        assignedPatientAvatarUrl: null,
        assignedAt: null,
    });
  };

  const generateBillForPatient = (patientId: string, billDetails: Omit<Bill, 'id' | 'billId' | 'status' | 'generatedAt' | 'generatedBy'>) => {
    const patient = dischargedPatientsForBilling.find(p => p.patientId === patientId);
    if (!patient) return;

    const newBill: Bill = {
        ...billDetails,
        id: `BILL-${Date.now()}`,
        billId: `INV-${patient.patientId.slice(4, 8)}-${new Date().getFullYear()}`,
        patientName: patient.name,
        status: 'Paid',
        generatedAt: new Date().toISOString(),
        generatedBy: 'rec1' // Hardcoded for demo
    }

    setBilledPatients(prev => [newBill, ...prev]);
    setDischargedPatientsForBilling(prev => prev.filter(p => p.patientId !== patientId));
  }

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }
  
  const clearAllData = () => {
    // This is a dangerous operation. In a real app, this would be heavily protected.
    // For the demo, we will clear collections.
    console.log("Clearing data is not fully implemented for Firestore yet. It will only clear local state.");
    window.localStorage.removeItem('dischargedPatients');
    window.localStorage.removeItem('billedPatients');
    window.localStorage.removeItem('appSettings');
    setDischargedPatientsForBilling([]);
    setBilledPatients([]);
    setSettings(initialSettings);
    // To clear firestore, you would need to delete documents one by one.
    // This is a complex operation and is omitted for this demo.
  };


  const value = {
    appointments,
    beds,
    patients,
    dischargedPatientsForBilling,
    billedPatients,
    settings,
    transferAppointment,
    updateAppointmentStatus,
    addAppointment,
    addPatient,
    addBed,
    assignPatientToBed,
    dischargePatientFromBed,
    generateBillForPatient,
    updateSettings,
    clearAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
